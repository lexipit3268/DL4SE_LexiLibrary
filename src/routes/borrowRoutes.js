/**
 * @file borrowRoutes.js
 * @description Routes cho nghiệp vụ mượn/trả sách và lịch sử mượn.
 *              Borrow Router → authenticate middleware → Controller → Service → MySQL Pool
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  createBorrowRecord,
  getUserBorrowHistory,
} from '../controllers/borrowController.js';

const borrowRouter = Router();

/**
 * POST /api/borrow
 * Mượn sách — yêu cầu JWT hợp lệ.
 */
borrowRouter.post('/', authenticate, createBorrowRecord);

/**
 * GET /api/users/:id/borrows
 * Lịch sử mượn của user — yêu cầu JWT hợp lệ.
 * Lưu ý: route này được mount tại /api/users (xem app.js), nên đường dẫn đầy đủ
 * là GET /api/users/:id/borrows.
 */
borrowRouter.get('/users/:id/borrows', authenticate, getUserBorrowHistory);

export default borrowRouter;
