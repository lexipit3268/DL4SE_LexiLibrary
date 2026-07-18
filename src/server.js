/**
 * @file server.js
 * @description Entry point của ứng dụng. Khởi động HTTP server sau khi kiểm tra
 *              kết nối database thành công. Xử lý graceful shutdown.
 */

import app from './app.js';
import { verifyDatabaseConnection } from './config/db.js';

const PORT = process.env.PORT ?? 3000;

async function startServer() {
  try {
    await verifyDatabaseConnection();

    const httpServer = app.listen(PORT, () => {
      console.info(`[Server] 🚀 LexiLibrary API đang chạy tại http://localhost:${PORT}`);
      console.info(`[Server] 📋 Môi trường: ${process.env.NODE_ENV ?? 'development'}`);
    });

    // Graceful shutdown: đóng server trước khi thoát tiến trình
    const shutdown = (signal) => {
      console.info(`\n[Server] Nhận tín hiệu ${signal}. Đang dừng server...`);
      httpServer.close(() => {
        console.info('[Server] ✅ Server đã dừng sạch.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  } catch (startupError) {
    console.error('[Server] ❌ Không thể khởi động:', startupError.message);
    process.exit(1);
  }
}

startServer();
