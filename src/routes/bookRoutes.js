/**
 * @file bookRoutes.js
 * @description Định nghĩa routes cho tài nguyên Book (theo kiến trúc Architecture.puml).
 *              Book Router → Controller → Service → MySQL Pool
 */

import { Router } from 'express';
import { listBooks } from '../controllers/bookController.js';

const bookRouter = Router();

/**
 * GET /api/books
 * Danh sách sách có phân trang và lọc thể loại.
 * Không yêu cầu xác thực — public endpoint.
 */
bookRouter.get('/', listBooks);

export default bookRouter;
