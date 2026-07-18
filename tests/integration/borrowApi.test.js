/**
 * @file borrowApi.test.js
 * @description Integration Tests cho endpoint POST /api/borrow.
 *
 * Chiến lược (ESM-compatible với jest.unstable_mockModule):
 *  - Mock '../../src/config/db.js'        → ngăn kết nối MySQL thật
 *  - Mock '../../src/services/borrowService.js' → kiểm soát kết quả trả về
 *  - Mock '../../src/middleware/authenticate.js' → giả lập xác thực JWT:
 *      * Khi request CÓ header "Authorization" → inject VALID_USER vào req
 *      * Khi request KHÔNG có header           → trả 401 (giống middleware thật)
 *  - Dùng Supertest với Express app thật từ src/app.js (không listen port thật)
 *  - Tất cả import phải là dynamic import() sau unstable_mockModule
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// ─── Hằng số ──────────────────────────────────────────────────────────────────
const VALID_USER    = { id: 1, email: 'reader@test.com', role: 'reader' };
const VALID_BOOK_ID = 10;

// ─── Mock DB (bắt buộc để app.js không crash khi import) ─────────────────────
jest.unstable_mockModule('../../src/config/db.js', () => ({
  default:                  { getConnection: jest.fn(), execute: jest.fn() },
  verifyDatabaseConnection: jest.fn().mockResolvedValue(undefined),
}));

// ─── Mock borrowService ────────────────────────────────────────────────────────
// Dùng jest.fn() cho cả 2 hàm export để test có thể mockResolvedValueOnce / mockRejectedValueOnce
const mockBorrowBook               = jest.fn();
const mockGetBorrowHistoryByUserId = jest.fn();

jest.unstable_mockModule('../../src/services/borrowService.js', () => ({
  borrowBook:               mockBorrowBook,
  getBorrowHistoryByUserId: mockGetBorrowHistoryByUserId,
}));

// ─── Mock authenticate middleware ─────────────────────────────────────────────
// Logic: nếu có Authorization header → vượt qua (inject user giả)
//        nếu không có               → trả 401 (giả lập hành vi middleware thật)
jest.unstable_mockModule('../../src/middleware/authenticate.js', () => ({
  authenticate: jest.fn((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Truy cập bị từ chối. Vui lòng đăng nhập để tiếp tục.',
      });
    }
    // Inject user giả vào request (không verify JWT thật → test nhanh và đơn giản)
    req.authenticatedUser = VALID_USER;
    next();
  }),
}));

// ─── Dynamic import SAU khi tất cả mock đã đăng ký ──────────────────────────
const { default: app }  = await import('../../src/app.js');
const { default: request } = await import('supertest');

// ─── Fake token (không cần verify thật vì middleware đã bị mock) ─────────────
const FAKE_BEARER_TOKEN = 'Bearer fake-test-token-for-integration';

// =============================================================================
// Test Suite: POST /api/borrow
// =============================================================================
describe('Integration — POST /api/borrow', () => {

  // Reset các mock function giữa mỗi test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── TC-01: Thành công (201) ───────────────────────────────────────────────
  describe('TC-01 | Mượn sách thành công (201)', () => {

    it('nên trả về HTTP 201 và data phiếu mượn khi token hợp lệ và sách còn', async () => {
      /**
       * Arrange: mockBorrowBook trả về phiếu mượn thành công
       */
      const fakeBorrowRecord = {
        id:          55,
        user_id:     VALID_USER.id,
        book_id:     VALID_BOOK_ID,
        borrow_date: new Date().toISOString(),
        due_date:    new Date(Date.now() + 14 * 86400000).toISOString(),
        status:      'borrowed',
      };
      mockBorrowBook.mockResolvedValueOnce(fakeBorrowRecord);

      /**
       * Act: POST /api/borrow với Authorization header
       */
      const response = await request(app)
        .post('/api/borrow')
        .set('Authorization', FAKE_BEARER_TOKEN)
        .send({ book_id: VALID_BOOK_ID });

      /**
       * Assert: HTTP 201 + body đúng cấu trúc
       */
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/thành công/i);
      expect(response.body.data).toMatchObject({
        id:      fakeBorrowRecord.id,
        user_id: VALID_USER.id,
        book_id: VALID_BOOK_ID,
        status:  'borrowed',
      });

      // Service được gọi đúng tham số (userId từ mock user, bookId từ request body)
      expect(mockBorrowBook).toHaveBeenCalledWith({
        userId: VALID_USER.id,
        bookId: VALID_BOOK_ID,
      });
    });
  });

  // ── TC-02: Không có token → 401 ──────────────────────────────────────────
  describe('TC-02 | Không có Authorization header (401)', () => {

    it('nên trả về HTTP 401 khi request thiếu header Authorization', async () => {
      /**
       * Act: POST /api/borrow mà KHÔNG có header Authorization
       */
      const response = await request(app)
        .post('/api/borrow')
        .send({ book_id: VALID_BOOK_ID });
        // Không gọi .set('Authorization', ...)

      /**
       * Assert: middleware chặn, service tuyệt đối không được gọi
       */
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/đăng nhập/i);
      expect(mockBorrowBook).not.toHaveBeenCalled();
    });
  });

  // ── TC-03: Sách hết → 400 ────────────────────────────────────────────────
  describe('TC-03 | Sách hết bản sẵn có (400)', () => {

    it('nên trả về HTTP 400 khi borrowService báo sách đã hết', async () => {
      /**
       * Arrange: service ném lỗi nghiệp vụ với statusCode 400.
       * Đây là lỗi được throw bởi borrowBook khi available_qty <= 0.
       */
      const outOfStockError = Object.assign(
        new Error('Sách "Clean Code" hiện đã hết bản sẵn có để mượn.'),
        { statusCode: 400 }
      );
      mockBorrowBook.mockRejectedValueOnce(outOfStockError);

      /**
       * Act: request hợp lệ (có token) nhưng service báo lỗi
       */
      const response = await request(app)
        .post('/api/borrow')
        .set('Authorization', FAKE_BEARER_TOKEN)
        .send({ book_id: VALID_BOOK_ID });

      /**
       * Assert: controller ánh xạ error.statusCode → HTTP 400
       */
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/hết bản sẵn có/i);
      expect(mockBorrowBook).toHaveBeenCalledTimes(1);
    });
  });

  // ── TC-04 (bổ sung): book_id không hợp lệ → validation 400 ──────────────
  describe('TC-04 | book_id không hợp lệ — validation tầng controller (400)', () => {

    it('nên trả về HTTP 400 nếu book_id âm và KHÔNG gọi service', async () => {
      /**
       * Validate xảy ra trong controller TRƯỚC khi gọi service.
       * Service không được gọi nếu input không hợp lệ.
       */
      const response = await request(app)
        .post('/api/borrow')
        .set('Authorization', FAKE_BEARER_TOKEN)
        .send({ book_id: -1 }); // ID âm → invalid

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/book_id/);
      // Validation ngăn service được gọi
      expect(mockBorrowBook).not.toHaveBeenCalled();
    });

    it('nên trả về HTTP 400 nếu book_id bị thiếu trong body', async () => {
      const response = await request(app)
        .post('/api/borrow')
        .set('Authorization', FAKE_BEARER_TOKEN)
        .send({}); // không có book_id

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mockBorrowBook).not.toHaveBeenCalled();
    });
  });
});
