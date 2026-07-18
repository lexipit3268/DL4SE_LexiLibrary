/**
 * @file borrowController.js
 * @description Xử lý HTTP request/response cho nghiệp vụ mượn sách.
 *              Ánh xạ lỗi từ service (có property statusCode) sang HTTP response đúng chuẩn.
 */

import { borrowBook, getBorrowHistoryByUserId } from '../services/borrowService.js';

/**
 * POST /api/borrow
 * Tạo phiếu mượn sách mới. Yêu cầu xác thực JWT.
 *
 * @body {number} book_id - ID của cuốn sách muốn mượn
 *
 * @param {import('express').Request}  req - req.authenticatedUser được inject bởi authenticate middleware
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function createBorrowRecord(req, res) {
  try {
    const { book_id: bookId } = req.body;
    const userId = req.authenticatedUser.id;

    // Validate input
    if (!bookId || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
      return res.status(400).json({
        success: false,
        message: '`book_id` là trường bắt buộc và phải là số nguyên dương.',
      });
    }

    const newBorrowRecord = await borrowBook({
      userId,
      bookId: Number(bookId),
    });

    res.status(201).json({
      success: true,
      message: 'Mượn sách thành công.',
      data: newBorrowRecord,
    });
  } catch (error) {
    // Service ném lỗi có statusCode cụ thể (404, 400) → ánh xạ trực tiếp
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('[BorrowController] createBorrowRecord error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý yêu cầu mượn sách.',
    });
  }
}

/**
 * GET /api/users/:id/borrows
 * Lấy lịch sử mượn sách của một người dùng cụ thể.
 * Yêu cầu xác thực JWT. Chỉ cho phép xem lịch sử của chính mình (trừ admin).
 *
 * @param {import('express').Request}  req - req.params.id là ID người dùng cần tra cứu
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function getUserBorrowHistory(req, res) {
  try {
    const requestedUserId = parseInt(req.params.id, 10);

    if (Number.isNaN(requestedUserId) || requestedUserId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ.',
      });
    }

    // Kiểm tra quyền: reader chỉ được xem lịch sử của chính mình
    const { id: tokenUserId, role: tokenUserRole } = req.authenticatedUser;
    const isRequestingOwnHistory = tokenUserId === requestedUserId;
    const hasPrivilegedRole      = tokenUserRole === 'librarian' || tokenUserRole === 'admin';

    if (!isRequestingOwnHistory && !hasPrivilegedRole) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem lịch sử mượn của người dùng khác.',
      });
    }

    const borrowHistory = await getBorrowHistoryByUserId(requestedUserId);

    res.status(200).json({
      success: true,
      data: borrowHistory,
    });
  } catch (error) {
    console.error('[BorrowController] getUserBorrowHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy lịch sử mượn sách.',
    });
  }
}
