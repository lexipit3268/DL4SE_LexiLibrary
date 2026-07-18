/**
 * @file app.js
 * @description Khởi tạo Express application: mount middleware toàn cục và các router.
 *              Tách biệt khỏi server.js để dễ import trong integration test (không listen port).
 */

import express from 'express';
import bookRouter   from './routes/bookRoutes.js';
import borrowRouter from './routes/borrowRoutes.js';

const app = express();

// --- Middleware toàn cục ---
app.use(express.json());                        // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse form data

// --- Mount routers (theo kiến trúc Architecture.puml: Book Router, Borrow Router) ---
app.use('/api/books',  bookRouter);
app.use('/api',        borrowRouter); // Borrow: POST /api/borrow + GET /api/users/:id/borrows

// --- Health check endpoint (không cần auth) ---
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- 404 handler cho các route không tồn tại ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint không tồn tại.' });
});

// --- Global error handler (bắt lỗi từ next(err)) ---
app.use((err, _req, res, _next) => {
  console.error('[GlobalErrorHandler]', err);
  res.status(500).json({ success: false, message: 'Lỗi máy chủ không xác định.' });
});

export default app;
