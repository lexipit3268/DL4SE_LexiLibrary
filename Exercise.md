# Xây dựng hệ thống Quản lý thư viện sách trực tuyến. Toàn bộ quy trình từ phân tích yêu

# cầu đến kiểm thử phải sử dụng công cụ AI để hỗ trợ.

# Nộp bài gồm: tài liệu yêu cầu, sơ đồ thiết kế, mã nguồn, báo cáo review, và test case -

# tất cả trong 1 file nén 7z.

# Được phép sử dụng: ChatGPT, GitHub Copilot, Claude, Gemini. Phải ghi lại prompt đã

# dùng với mỗi phần.

# Phần 1 - Tạo yêu cầu: Dùng AI sinh 5 User Stories đúng chuẩn As a/I want/So that

# kèm Acceptance Criteria, và phân tích 4 yêu cầu phi chức năng có tiêu chí đo lường.

# Câu 1.1 - Tạo User Stories bằng AI

# Yêu cầu

# Sử dụng công cụ AI để tạo 5 User Story cho hệ thống Quản lý Thư viện Sách Trực

# Tuyến theo đúng chuẩn:

# • Đủ 3 vai trò: Độc giả, Thủ thư, Quản trị viên

# • Mỗi user story có: Title, As a / I want / So that, Acceptance Criteria (ít nhất 2 tiêu

# chí)

# • Ghi lại prompt đã nhập vào AI

# Đáp án mẫu - Prompt gợi ý

# Prompt: "Hãy tạo 5 user stories cho hệ thống thư viện sách trực tuyến. Gồm các vai trò:

# Độc giả, Thủ thư, Quản trị viên. Mỗi user story theo chuẩn: 'As a [role], I want

# [feature], so that [benefit]'. Kèm ít nhất 2 Acceptance Criteria."

# Kết quả mẫu (1 trong 5):

# • US-01: As a Độc giả, I want to search books by title/author/genre, so that I can

# quickly find books of interest

# • AC1: Kết quả hiển thị trong vòng 2 giây

# • AC2: Hiển thị tên sách, tác giả, trạng thái còn/hết

# Câu 1.2 - Phân tích yêu cầu phi chức năng

# Yêu cầu

# Dùng AI để phân tích và liệt kê 4 yêu cầu phi chức năng (Non-Functional

# Requirements) quan trọng cho hệ thống, mỗi yêu cầu kèm tiêu chí đo lường cụ thể.

# Đáp án mẫu

# • Hiệu năng: Thời gian tải trang ≤ 3 giây với 1000 người dùng đồng thời

# • Bảo mật: Mã hóa mật khẩu bằng bcrypt, JWT hết hạn sau 24h

# • Khả dụng: Uptime ≥ 99.5% theo tháng

# • Khả năng mở rộng: Hỗ trợ tối thiểu 10,000 đầu sách, scale ngang được

# Phần 2 - Thiết kế: Dùng AI tạo kiến trúc 3-tier dạng Mermaid/PlantUML và lược đồ

# CSDL với đủ quan hệ khóa ngoại.

# Câu 2.1 - Thiết kế kiến trúc hệ thống

# Yêu cầu

# Dùng AI tạo sơ đồ kiến trúc hệ thống dạng mô tả (text-based) hoặc PlantUML/Mermaid,

# thể hiện:

# • Kiến trúc 3 tầng (Frontend – Backend API – Database)

# • Các thành phần chính và luồng giao tiếp

# • Lý do chọn kiến trúc này (2-3 câu)

# Đáp án mẫu

# Prompt: "Tạo sơ đồ kiến trúc Mermaid cho hệ thống thư viện sách, kiến trúc 3 - tier:

# React frontend, Node.js REST API, PostgreSQL database. Bao gồm Auth Se rvice và

# Search Service."

# • Frontend: React + Axios gọi REST API

# • Backend: Node.js/Express, gồm modules: Auth, Book, Borrow, Search

# • Database: PostgreSQL (dữ liệu chính) + Redis (cache tìm kiếm)

# • Lý do: Tách biệt các mối quan tâm, dễ co giãn từng tầng độc lập

# Câu 2.2 - Thiết kế CSDL bằng AI

# Yêu cầu

# Dùng AI sinh ra schema database với ít nhất 4 bảng : Users, Books, BorrowRecords,

# Categories. Yêu cầu:

# • Đủ khóa chính, khóa ngoại, kiểu dữ liệu phù hợp

# • Giải thích quan hệ giữa các bảng

# Đáp án mẫu - Schema tóm tắt

# • users(id, email, password_hash, role, created_at)

# • categories(id, name, description)

# • books(id, title, author, isbn, category_id FK, quantity, available_qty)

# • borrow_records(id, user_id FK, book_id FK, borrow_date, due_date,

# return_date, status)

# • Quan hệ: Books N–1 Categories; BorrowRecords N–1 Users và N–1 Books

# Phần 3 - Sinh mã lệnh: Dùng Copilot/ChatGPT sinh 3 API endpoint Node.js + Express

# hoàn chỉnh, và tái cấu trúc (refactor) đoạn mã cho sẵn theo phương pháp hay nhất.

# Câu 3.1 - Sinh API endpoint bằng AI

# Yêu cầu

# Dùng AI (Copilot/ChatGPT) sinh mã nguồn cho 3 API endpoint bằng Node.js +

# Express:

# • GET /api/books - Lấy danh sách sách có phân trang và lọc theo thể loại

# • POST /api/borrow - Mượn sách (kiểm tra còn sách không)

# • GET /api/users/:id/borrows - Lịch sử mượn của 1 người dùng

# Mỗi endpoint phải có: xử lý lỗi, mã trạng thái HTTP đúng, chú thích mô tả.

# Đáp án mẫu - Tiêu chí chấm điểm

# • Prompt rõ ràng, đặc tả đủ: tên route, method, tham số, logic nghiệp vụ

# • Code chạy được, không lỗi cú pháp

# • Xử lý trường hợp lỗi: 400, 404, 500 đúng ngữ cảnh

# • Có middleware xác thực JWT cho route cần bảo vệ

# • Có comment/JSDoc mô tả endpoint

# Câu 3.2 – Tái cấu trúc (Refactor) mã với AI

# Yêu cầu

# Cho đoạn mã sau (mã nguồn kém chất lượng được cung cấp kèm đề). Dùng AI để

# refactor, đảm bảo:

# • Tách hàm, đặt tên biến có nghĩa

# • Xóa code trùng lặp

# • Giải thích ngắn những thay đổi AI đề xuất

# Đáp án mẫu - Các điểm cần refactor

# • Thay biến x, y, d thành userId, bookId, dueDate

# • Tách logic tính ngày hạn ra hàm calculateDueDate()

# • Dùng async/await thay callback lồng nhau

# • Dùng early return để giảm nesting

# • Chuyển magic number (7) thành constant BORROW_DAYS = 7

# Phần 4 - Review code: Dùng AI phát hiện và phân loại lỗi

# (Bug/Security/Performance/Style), đánh giá mức độ ưu tiên và đề xuất cách sửa.

# Câu 4.1 - AI-assisted Code Review

# Yêu cầu

# Cho đoạn mã nguồn (cung cấp kèm theo) có chứa ít nhất 3 vấn đề. Dùng AI để review,

# sau đó:

# 1. Liệt kê các vấn đề AI phát hiện được (phân loại: Bug / Security / Performance /

# Style)

# 2. Đánh giá mức độ ưu tiên: Critical / High / Medium / Low cho từng vấn đề

# 3. Đề xuất cách sửa cho ít nhất 2 vấn đề

# Đáp án mẫu - Các vấn đề trong mã mẫu

# • [Security - Critical] SQL query dùng string concatenation → SQL Injection.

# Sửa: dùng parameterized query db.query('SELECT \* FROM books WHERE id

# = $1', [id])

# • [Bug - High] Không kiểm tra book.available_qty > 0 trước khi cho mượn → cho

# mượn khi hết sách

# • [Performance - Medium] Load toàn bộ danh sách không phân trang → thêm

# LIMIT/OFFSET

# • [Style - Low] Không có xử lý lỗi cho async, thiếu try/catch

# Prompt mẫu: "Review đoạn code này và phân loại các vấn đề theo Bug / Security /

# Performance / Style, kèm mức độ ưu tiên"

# Phần 5 - Kiểm thử: Dùng AI sinh unit test với Jest (mock DB) và integration test với

# Supertest, bao phủ đủ happy path lẫn edge case.

# Câu 5.1 - Sinh Test Cases bằng AI

# Yêu cầu

# Dùng AI tạo unit test cho function borrowBook(userId, bookId) bằng Jest. Phải bao

# gồm:

# • Ít nhất 4 test case: happy path + các edge case (sách hết, user không tồn tại, mượn

# trùng)

# • Dùng mock/stub cho database call

# • Test chạy được và pass

# Đáp án mẫu - Danh sách test case cần có

# • should return borrow record when book is available → Happy path

# • should throw error when book quantity is 0 → Edge case hết sách

# • should throw error when user not found → Edge case user sai

# • should throw error when user already borrowed the same book → Duplicate

# borrow

# • Mock: jest.mock('../db'), mockReturnValue trả về dữ liệu giả

# Câu 5.2 - Sinh Test Cases API (Integration Test)

# Yêu cầu

# Dùng AI tạo 3 integration test cho API POST /api/borrow bằng Supertest + Jest, kiểm

# tra các trường hợp: thành công (201), không có token (401), sách hết (400).

# Tiêu chí chấm điểm

# • Test case kiểm tra đúng HTTP status code

# • Có setup/teardown cho test database

# • Assert đúng response body

# • Test độc lập, không phụ thuộc thứ tự chạy

# Tiêu chí quan trọng xuyên suốt: sinh viên phải ghi lại prompt đã dùng cho mỗi phần

# để đánh giá kỹ năng tương tác với AI.

# Ví dụ chức năng đăng nhập:

// LoginServlet.java (có lỗi cố ý)
import java.io._;
import javax.servlet._;
import javax.servlet.http._;
import java.sql._;

public class LoginServlet extends HttpServlet {
protected void doPost(HttpServletRequest request, HttpServletResponse
response)
throws ServletException, IOException {
String username = request.getParameter("username");
String password = request.getParameter("password");
PrintWriter out = response.getWriter();
try {

Connection conn =
DriverManager.getConnection("jdbc:mysql://localhost:3306/appdb", "root",
"");
Statement stmt = conn.createStatement();
String query = "SELECT \* FROM users WHERE username = '" +
username + "' AND password = '" + password + "'";
ResultSet rs = stmt.executeQuery(query);
if (rs.next()) {
HttpSession session = request.getSession();
session.setAttribute("user", username);
out.println("Login success");
} else {
out.println("Invalid credentials");
}
conn.close();
} catch (Exception e) {
out.println("Error");
}
}
}

## Loại lỗi Mô tả chi tiết

## Bug

## Không kiểm tra null cho username/password; không đóng ResultSet,

## Statement; ngoại lệ bị nuốt, không log; nếu lỗi vẫn in "Error" nhưng không

## rollback; dùng out.println sau khi response đã commit có thể gây lỗi.

## Security

## SQL Injection nghiêm trọng. Lưu mật khẩu plain text. Không mã hóa kết

## nối DB (root, empty pass). Không escape output. Session fixation không được

## xử lý. Không giới hạn số lần login sai.

## Performance

## SELECT \* không cần thiết. Tạo kết nối mới mỗi request (không dùng

## connection pool). Không dùng PreparedStatement.

## Style

## Thiếu indent, không tuân thủ Java naming conventions (conn, stmt, rs chung

## chung). Ngoại lệ bỏ trống. Xử lý logic và hiển thị lẫn lộn.

# Cải tiến

src/
├── config/DBConnection.java (connection pool)
├── dao/UserDAO.java
├── model/User.java
├── servlet/LoginServlet.java
├── utils/PasswordUtils.java
└── filter/SecurityFilter.java

## DBConnection.java (HikariCP connection pool)

## java

package config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DBConnection {
private static HikariDataSource dataSource;
static {
HikariConfig config = new HikariConfig();

config.setJdbcUrl("jdbc:mysql://localhost:3306/appdb?useSSL=false&serverTim
ezone=UTC");
config.setUsername("appuser");
config.setPassword("strongpassword");
config.setMaximumPoolSize(10);
dataSource = new HikariDataSource(config);
}
public static Connection getConnection() throws SQLException {
return dataSource.getConnection();
}
}

## User.java

## java

package model;

public class User {
private int id;
private String username;
private String passwordHash;
// getters/setters
}

## UserDAO.java (dùng PreparedStatement)

## java

package dao;

import model.User;
import java.sql.\*;

public class UserDAO {
public User findByUsername(String username) {
String sql = "SELECT id, username, password_hash FROM users WHERE
username = ?";
try (Connection conn = config.DBConnection.getConnection();
PreparedStatement ps = conn.prepareStatement(sql)) {
ps.setString(1, username);
try (ResultSet rs = ps.executeQuery()) {
if (rs.next()) {
User user = new User();
user.setId(rs.getInt("id"));
user.setUsername(rs.getString("username"));
user.setPasswordHash(rs.getString("password_hash"));
return user;
}
}
} catch (SQLException e) {
e.printStackTrace(); // log qua Log4j hoặc SLF4J
}
return null;
}
}

## PasswordUtils.java (BCrypt)

## java

package utils;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtils {

public static boolean verifyPassword(String plainPassword, String
hashedPassword) {
return BCrypt.checkpw(plainPassword, hashedPassword);
}
}

## LoginServlet.java (đã sửa lỗi)

## java

package servlet;

import dao.UserDAO;
import model.User;
import utils.PasswordUtils;
import javax.servlet.ServletException;
import javax.servlet.http.\*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
private UserDAO userDAO = new UserDAO();

@Override
protected void doPost(HttpServletRequest request, HttpServletResponse
response)
throws ServletException, IOException {
String username = request.getParameter("username");
String password = request.getParameter("password");

if (username == null || password == null ||
username.trim().isEmpty() || password.isEmpty()) {
response.sendError(HttpServletResponse.SC_BAD_REQUEST,
"Username and password required");
return;
}

username = username.trim();

// Chống brute-force nhẹ (có thể kết hợp với Redis hoặc bảng
login_attempts)
synchronized (this) {
try { Thread.sleep(500 + (int)(Math.random() \* 500)); } catch
(InterruptedException e) { Thread.currentThread().interrupt(); }
}

User user = userDAO.findByUsername(username);
if (user != null && PasswordUtils.verifyPassword(password,
user.getPasswordHash())) {
HttpSession session = request.getSession();
session.invalidate(); // tránh session fixation
session = request.getSession(true);
session.setAttribute("userId", user.getId());
session.setAttribute("username", user.getUsername());
session.setMaxInactiveInterval(30 \* 60); // 30 phút

response.sendRedirect(request.getContextPath() + "/dashboard");
} else {
// Log lỗi (dùng log framework)
getServletContext().log("Failed login for user: " + username +
" from IP: " + request.getRemoteAddr());
response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
"Invalid username or password");
}
}

@Override

protected void doGet(HttpServletRequest request, HttpServletResponse
response)
throws ServletException, IOException {
response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
}
}

## Mục Mã cũ Mã mới

## Bug

## Nuốt exception, không

## đóng resource, lỗi logic

## Dùng try-with-resources, kiểm tra null, xử lý lỗi

## rõ ràng

## Security

## SQL injection, plaintext

## password, root login

## PreparedStatement, BCrypt, connection pool user

## riêng, ngăn ngừa session fixation

## Performance

## Kết nối mới mỗi request,

## SELECT \*

## connection pool, chỉ select cần thiết

## Style

## Code lộn xộn, in ra

## response lẫn logic

## Tách DAO, model, utils, tuân thủ Java

## conventions
