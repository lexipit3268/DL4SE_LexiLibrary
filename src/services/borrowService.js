/**
 * @file borrowService.js
 * @description Database logic cho nghiệp vụ mượn sách.
 *              Dùng transaction để đảm bảo tính toàn vẹn dữ liệu:
 *              INSERT borrow_record và UPDATE available_qty là 1 đơn vị nguyên tử.
 */

import pool from '../config/db.js';

/** Số ngày mượn mặc định (tránh magic number trong code nghiệp vụ) */
const DEFAULT_BORROW_DURATION_DAYS = 14;

/**
 * @typedef {Object} CreateBorrowInput
 * @property {number} userId - ID người mượn (lấy từ JWT)
 * @property {number} bookId - ID cuốn sách muốn mượn
 */

/**
 * @typedef {Object} BorrowRecord
 * @property {number} id          - ID phiếu mượn mới tạo
 * @property {number} user_id
 * @property {number} book_id
 * @property {Date}   borrow_date
 * @property {Date}   due_date
 * @property {string} status      - 'borrowed'
 */

/**
 * @typedef {Object} BorrowHistoryRow
 * @property {number}      id           - ID phiếu mượn
 * @property {number}      book_id
 * @property {string}      book_title   - Lấy qua JOIN với bảng books
 * @property {string}      book_author
 * @property {Date}        borrow_date
 * @property {Date}        due_date
 * @property {Date|null}   return_date
 * @property {string}      status       - 'borrowed' | 'returned' | 'overdue'
 */

/**
 * Thực hiện nghiệp vụ mượn sách bên trong một transaction.
 *
 * Luồng xử lý:
 *  1. Lấy kết nối riêng từ pool (để dùng transaction)
 *  2. Kiểm tra available_qty > 0 (dùng SELECT ... FOR UPDATE để tránh race condition)
 *  3. Giảm available_qty đi 1
 *  4. INSERT vào borrow_records
 *  5. COMMIT hoặc ROLLBACK nếu xảy ra lỗi
 *
 * @param {CreateBorrowInput} input
 * @returns {Promise<BorrowRecord>} Phiếu mượn vừa tạo
 * @throws {Error} Với property `statusCode` để controller map sang HTTP status
 */
export async function borrowBook({ userId, bookId }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // SELECT ... FOR UPDATE: lock row để tránh 2 user mượn cùng 1 bản cuối cùng đồng thời
    const [bookRows] = await connection.execute(
      'SELECT id, title, available_qty FROM books WHERE id = ? FOR UPDATE',
      [bookId]
    );

    if (bookRows.length === 0) {
      const bookNotFoundError = new Error('Không tìm thấy sách với ID đã cung cấp.');
      bookNotFoundError.statusCode = 404;
      throw bookNotFoundError;
    }

    const targetBook = bookRows[0];

    if (targetBook.available_qty <= 0) {
      const outOfStockError = new Error(`Sách "${targetBook.title}" hiện đã hết bản sẵn có để mượn.`);
      outOfStockError.statusCode = 400;
      throw outOfStockError;
    }

    // Giảm available_qty đi 1
    await connection.execute(
      'UPDATE books SET available_qty = available_qty - 1 WHERE id = ?',
      [bookId]
    );

    // Tính ngày hết hạn mượn
    const borrowDate = new Date();
    const dueDate   = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + DEFAULT_BORROW_DURATION_DAYS);

    // Tạo phiếu mượn mới
    const [insertResult] = await connection.execute(
      `INSERT INTO borrow_records (user_id, book_id, borrow_date, due_date, status)
       VALUES (?, ?, ?, ?, 'borrowed')`,
      [userId, bookId, borrowDate, dueDate]
    );

    await connection.commit();

    /** @type {BorrowRecord} */
    const newBorrowRecord = {
      id:          insertResult.insertId,
      user_id:     userId,
      book_id:     bookId,
      borrow_date: borrowDate,
      due_date:    dueDate,
      status:      'borrowed',
    };

    return newBorrowRecord;
  } catch (error) {
    await connection.rollback();
    throw error; // Re-throw để controller xử lý và trả HTTP status đúng
  } finally {
    connection.release(); // Luôn trả kết nối về pool
  }
}

/**
 * Lấy toàn bộ lịch sử mượn của một người dùng.
 * Dùng INNER JOIN để trả về tên sách thay vì chỉ trả book_id.
 *
 * @param {number} userId - ID người dùng cần xem lịch sử
 * @returns {Promise<BorrowHistoryRow[]>}
 */
export async function getBorrowHistoryByUserId(userId) {
  const sql = `
    SELECT
      br.id,
      br.book_id,
      b.title       AS book_title,
      b.author      AS book_author,
      br.borrow_date,
      br.due_date,
      br.return_date,
      br.status
    FROM borrow_records br
    INNER JOIN books b ON br.book_id = b.id
    WHERE br.user_id = ?
    ORDER BY br.borrow_date DESC
  `;

  const [borrowHistory] = await pool.execute(sql, [userId]);
  return borrowHistory;
}
