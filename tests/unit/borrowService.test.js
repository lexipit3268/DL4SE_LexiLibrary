/**
 * @file borrowService.test.js
 * @description Unit Tests cho borrowService.borrowBook().
 *
 * Chiến lược mock (ESM-compatible):
 *  - Dùng jest.unstable_mockModule() — API chính thức của Jest để mock ESM modules.
 *  - mockConnection được tạo bằng jest.fn() và truyền vào qua closure của factory.
 *  - Import subject-under-test (borrowService) phải nằm SAU jest.unstable_mockModule()
 *    và sử dụng dynamic import() để Jest kịp inject mock.
 *  - beforeEach reset tất cả mock → mỗi test hoàn toàn độc lập.
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// ─── Tạo mock connection object ───────────────────────────────────────────────
// Khai báo tại module scope để có thể dùng trong cả mock factory lẫn test body.
const mockConnection = {
  beginTransaction: jest.fn(),
  execute:          jest.fn(),
  commit:           jest.fn(),
  rollback:         jest.fn(),
  release:          jest.fn(),
};

// Mock pool với getConnection trả về mockConnection ở trên
const mockPool = {
  getConnection: jest.fn().mockResolvedValue(mockConnection),
};

// ─── Đăng ký mock TRƯỚC dynamic import ───────────────────────────────────────
// jest.unstable_mockModule là cách ESM-safe để mock module,
// thay thế cho jest.mock() vốn không hỗ trợ tốt với ESM native.
jest.unstable_mockModule('../../src/config/db.js', () => ({
  default:                  mockPool,
  verifyDatabaseConnection: jest.fn().mockResolvedValue(undefined),
}));

// ─── Dynamic import PHẢI sau unstable_mockModule ──────────────────────────────
// Với ESM, import tĩnh được hoisted nên bắt buộc dùng dynamic import ở đây.
const { borrowBook } = await import('../../src/services/borrowService.js');

// ─── Dữ liệu dùng chung ───────────────────────────────────────────────────────
const VALID_INPUT    = { userId: 1, bookId: 10 };
const MOCK_BOOK_ROW  = { id: 10, title: 'Clean Code', available_qty: 3 };
const MOCK_INSERT_ID = 99;

// =============================================================================
// Test Suite: borrowBook()
// =============================================================================
describe('borrowService.borrowBook()', () => {

  // Trước mỗi test: reset toàn bộ mock state để tránh ảnh hưởng chéo giữa tests
  beforeEach(() => {
    jest.clearAllMocks();

    // Thiết lập lại behavior mặc định
    mockPool.getConnection.mockResolvedValue(mockConnection);
    mockConnection.beginTransaction.mockResolvedValue(undefined);
    mockConnection.commit.mockResolvedValue(undefined);
    mockConnection.rollback.mockResolvedValue(undefined);
    mockConnection.release.mockResolvedValue(undefined);
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────
  describe('Happy Path — mượn sách thành công', () => {

    it('nên trả về BorrowRecord khi sách còn bản sẵn có (available_qty > 0)', async () => {
      /**
       * Setup: execute() được gọi 3 lần trong transaction:
       *   1. SELECT ... FOR UPDATE  → book row với available_qty = 3
       *   2. UPDATE books ...       → affectedRows: 1
       *   3. INSERT borrow_records  → insertId: 99
       */
      mockConnection.execute
        .mockResolvedValueOnce([[MOCK_BOOK_ROW]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([{ insertId: MOCK_INSERT_ID }]);

      const result = await borrowBook(VALID_INPUT);

      // Kiểm tra cấu trúc record trả về
      expect(result).toMatchObject({
        id:      MOCK_INSERT_ID,
        user_id: VALID_INPUT.userId,
        book_id: VALID_INPUT.bookId,
        status:  'borrowed',
      });
      expect(result.borrow_date).toBeInstanceOf(Date);
      expect(result.due_date).toBeInstanceOf(Date);

      // Transaction phải được COMMIT
      expect(mockConnection.commit).toHaveBeenCalledTimes(1);
      expect(mockConnection.rollback).not.toHaveBeenCalled();
      // Connection luôn được trả về pool (finally block)
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it('due_date phải sau borrow_date đúng 14 ngày (DEFAULT_BORROW_DURATION_DAYS)', async () => {
      mockConnection.execute
        .mockResolvedValueOnce([[MOCK_BOOK_ROW]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      const result = await borrowBook(VALID_INPUT);

      const diffDays = (result.due_date - result.borrow_date) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBe(14);
    });
  });

  // ── Edge Case 1: Sách hết (available_qty = 0) ─────────────────────────────
  describe('Edge Case 1 — sách đã hết bản sẵn có (available_qty = 0)', () => {

    it('nên ném Error với statusCode 400', async () => {
      const outOfStockBook = { ...MOCK_BOOK_ROW, available_qty: 0 };
      mockConnection.execute.mockResolvedValueOnce([[outOfStockBook]]);

      await expect(borrowBook(VALID_INPUT)).rejects.toMatchObject({
        statusCode: 400,
        message:    expect.stringContaining('hết bản sẵn có'),
      });

      // Lỗi nghiệp vụ → không COMMIT
      expect(mockConnection.commit).not.toHaveBeenCalled();
      // Phải ROLLBACK để giải phóng lock FOR UPDATE
      expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
      // Connection phải về pool dù lỗi
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
  });

  // ── Edge Case 2: User/sách không tồn tại ──────────────────────────────────
  describe('Edge Case 2 — bookId không tồn tại trong DB', () => {

    it('nên ném Error với statusCode 404 khi SELECT trả về mảng rỗng', async () => {
      // SELECT ... FOR UPDATE không tìm thấy row nào
      mockConnection.execute.mockResolvedValueOnce([[]]); // empty

      await expect(borrowBook({ userId: 1, bookId: 9999 })).rejects.toMatchObject({
        statusCode: 404,
        message:    expect.stringContaining('Không tìm thấy sách'),
      });

      expect(mockConnection.commit).not.toHaveBeenCalled();
      expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
  });

  // ── Edge Case 3: Duplicate Borrow ─────────────────────────────────────────
  describe('Edge Case 3 — user đang mượn cuốn sách này rồi (Duplicate)', () => {

    it('nên re-throw ER_DUP_ENTRY từ DB và ROLLBACK transaction', async () => {
      /**
       * Giả lập UNIQUE constraint violation khi INSERT:
       * Trường hợp DB có UNIQUE(user_id, book_id) trên active borrows.
       */
      const duplicateError = Object.assign(new Error('Duplicate entry'), {
        code:  'ER_DUP_ENTRY',
        errno: 1062,
      });

      mockConnection.execute
        .mockResolvedValueOnce([[MOCK_BOOK_ROW]])      // SELECT → ok
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // UPDATE → ok
        .mockRejectedValueOnce(duplicateError);         // INSERT → constraint fail

      await expect(borrowBook(VALID_INPUT)).rejects.toMatchObject({
        code:    'ER_DUP_ENTRY',
        message: expect.stringContaining('Duplicate entry'),
      });

      expect(mockConnection.commit).not.toHaveBeenCalled();
      expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
  });

  // ── Infrastructure error ───────────────────────────────────────────────────
  describe('Infrastructure error — pool.getConnection() thất bại', () => {

    it('nên ném lỗi ngay lập tức nếu không lấy được connection từ pool', async () => {
      const connError = new Error('Pool exhausted');
      mockPool.getConnection.mockRejectedValueOnce(connError);

      await expect(borrowBook(VALID_INPUT)).rejects.toThrow('Pool exhausted');

      // Không có connection nên không thể release
      expect(mockConnection.release).not.toHaveBeenCalled();
    });
  });
});
