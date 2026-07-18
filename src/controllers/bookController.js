/**
 * @file bookController.js
 * @description Xử lý HTTP request/response cho tài nguyên Book.
 *              Controller KHÔNG chứa SQL. Mọi logic DB ủy thác về bookService.
 */

import { getPaginatedBooks } from '../services/bookService.js';

/**
 * GET /api/books
 * Lấy danh sách sách có phân trang và lọc theo thể loại.
 *
 * @query {number} [page=1]        - Trang hiện tại (bắt đầu từ 1)
 * @query {number} [limit=10]      - Số sách mỗi trang (tối đa 100)
 * @query {number} [category_id]   - Lọc theo ID thể loại (không bắt buộc)
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function listBooks(req, res) {
  try {
    const page       = Math.max(1, parseInt(req.query.page  ?? '1',  10));
    const limit      = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '10', 10)));
    const categoryId = req.query.category_id
      ? parseInt(req.query.category_id, 10)
      : undefined;

    // Kiểm tra tham số không hợp lệ
    if (Number.isNaN(page) || Number.isNaN(limit)) {
      return res.status(400).json({
        success: false,
        message: 'Tham số `page` và `limit` phải là số nguyên dương.',
      });
    }

    if (categoryId !== undefined && Number.isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Tham số `category_id` phải là số nguyên.',
      });
    }

    const { books, totalCount } = await getPaginatedBooks({ page, limit, categoryId });

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage:  page,
        itemsPerPage: limit,
        totalItems:   totalCount,
        totalPages:   Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('[BookController] listBooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy danh sách sách.',
    });
  }
}
