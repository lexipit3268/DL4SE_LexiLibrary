/**
 * @file authenticate.js
 * @description Middleware xác thực JWT — bảo vệ các route cần đăng nhập.
 *              Inject payload đã giải mã vào req.authenticatedUser để controller dùng tiếp.
 */

import jwt from 'jsonwebtoken';

/**
 * @typedef {Object} AuthenticatedUser
 * @property {number} id    - ID người dùng lấy từ JWT payload
 * @property {string} email - Email người dùng lấy từ JWT payload
 * @property {string} role  - Vai trò: 'reader' | 'librarian' | 'admin'
 */

/**
 * Express middleware kiểm tra Bearer token trong header Authorization.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
export function authenticate(req, res, next) {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Truy cập bị từ chối. Vui lòng đăng nhập để tiếp tục.',
    });
  }

  const token = authorizationHeader.slice(7); // Bỏ prefix "Bearer "

  try {
    /** @type {AuthenticatedUser} */
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.authenticatedUser = decodedPayload;
    next();
  } catch (jwtError) {
    const isExpired = jwtError.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired
        ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        : 'Token không hợp lệ.',
    });
  }
}
