/**
 * @file bookService.js
 * @description Toàn bộ database logic liên quan đến bảng `books` và `categories`
 *              (theo Schema.puml). Controller KHÔNG được query DB trực tiếp.
 */

import pool from '../config/db.js';

/**
 * @typedef {Object} BookListResult
 * @property {BookRow[]} books      - Mảng sách trong trang hiện tại
 * @property {number}    totalCount - Tổng số sách khớp điều kiện lọc
 */

/**
 * @typedef {Object} BookRow
 * @property {number}      id           - ID sách
 * @property {string}      title        - Tiêu đề
 * @property {string}      author       - Tác giả
 * @property {string|null} isbn         - ISBN (unique)
 * @property {number}      category_id  - FK → categories.id
 * @property {string}      category_name - Tên thể loại (JOIN từ categories)
 * @property {number}      quantity     - Tổng số bản in
 * @property {number}      available_qty - Số bản còn có thể mượn
 */

/**
 * Lấy danh sách sách có hỗ trợ phân trang và lọc theo category.
 * Dùng COUNT(*) OVER() (window function) để tránh phải query 2 lần.
 *
 * @param {{ page: number, limit: number, categoryId?: number }} options
 * @returns {Promise<BookListResult>}
 */
export async function getPaginatedBooks({ page, limit, categoryId }) {
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện WHERE linh hoạt để tránh SQL injection
  const filterConditions = [];
  const queryParams = [];

  if (categoryId) {
    filterConditions.push('b.category_id = ?');
    queryParams.push(categoryId);
  }

  const whereClause = filterConditions.length > 0
    ? `WHERE ${filterConditions.join(' AND ')}`
    : '';

  // Dùng window function COUNT(*) OVER() — tránh phải query đếm riêng
  const sql = `
    SELECT
      b.id,
      b.title,
      b.author,
      b.isbn,
      b.category_id,
      c.name      AS category_name,
      b.quantity,
      b.available_qty,
      COUNT(*) OVER() AS total_count
    FROM books b
    INNER JOIN categories c ON b.category_id = c.id
    ${whereClause}
    ORDER BY b.title ASC
    LIMIT ? OFFSET ?
  `;

  queryParams.push(limit, offset);

  const [rows] = await pool.execute(sql, queryParams);

  const totalCount = rows.length > 0 ? Number(rows[0].total_count) : 0;

  // Xóa trường total_count khỏi từng row trước khi trả về client
  const books = rows.map(({ total_count, ...bookFields }) => bookFields);

  return { books, totalCount };
}
