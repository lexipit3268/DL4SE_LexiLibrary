/**
 * @file db.js
 * @description Khởi tạo MySQL connection pool dùng mysql2/promise.
 *              Mọi module trong project import pool này thay vì tự tạo kết nối riêng.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connection pool được chia sẻ toàn ứng dụng.
 * Cấu hình tối đa 10 kết nối đồng thời theo kiến trúc trong Architecture.puml.
 * @type {import('mysql2/promise').Pool}
 */
const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? 'localhost',
  port:               Number(process.env.DB_PORT ?? 3306),
  database:           process.env.DB_NAME     ?? 'lexilibrary',
  user:               process.env.DB_USER     ?? 'appuser',
  password:           process.env.DB_PASSWORD ?? '',
  connectionLimit:    10,
  waitForConnections: true,
  queueLimit:         0,
  // Tự động parse kiểu DATE/DATETIME thành đối tượng JS Date
  dateStrings:        false,
  timezone:           '+07:00',
});

/**
 * Kiểm tra kết nối database khi ứng dụng khởi động.
 * Ghi log rõ ràng để DevOps có thể theo dõi.
 * @returns {Promise<void>}
 */
export async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();
  console.info('[DB] ✅ Kết nối MySQL thành công — host:', process.env.DB_HOST ?? 'localhost');
  connection.release();
}

export default pool;
