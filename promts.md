# Phần 1

## Phần 1.1

Đóng vai là một chuyên gia phân tích nghiệp vụ. Hãy viết 5 User Stories cho hệ thống quản lý thư viện trực tuyến tên là LexiLibrary. Yêu cầu bao gồm 3 vai trò: Độc giả, Thủ thư (Nhân viên thư viện), và Quản trị viên. Mỗi User Story phải viết theo chuẩn 'As a [role], I want [feature], so that [benefit]' và kèm theo ít nhất 2 Acceptance Criteria (Tiêu chí chấp nhận) chi tiết.

## Phần 1.2

Hãy phân tích và liệt kê 4 yêu cầu phi chức năng (Non-Functional Requirements) quan trọng nhất cho hệ thống thư viện LexiLibrary. Mỗi yêu cầu phải kèm theo các tiêu chí đo lường định lượng cụ thể, có thể kiểm thử được.

# Phần 2

## Phần 2.1

Đóng vai là một Software Architect. Hãy tạo sơ đồ kiến trúc hệ thống 3-tier (3 tầng) dạng PlantUML cho hệ thống thư viện LexiLibrary. Hệ thống sử dụng: React (Frontend), Node.js/Express (Backend REST API), và MySQL (Database). Liệt kê các thành phần chính và viết 3 câu giải thích lý do lựa chọn kiến trúc này.

## Phần 2.2

Thiết kế lược đồ cơ sở dữ liệu (Database Schema) cho hệ thống LexiLibrary sử dụng MySQL. Yêu cầu tạo đúng 4 bảng: users, categories, books, borrow_records. Cung cấp mã PlantUML dạng Entity-Relationship (ER Diagram) thể hiện đầy đủ cấu trúc bảng (kiểu dữ liệu, khóa chính PK, khóa ngoại FK) và các đường nối thể hiện mối quan hệ.

# Phần 3

**Ngữ cảnh & Dữ liệu đầu vào:**
Đọc toàn bộ các tệp tin có trong thư mục `@docs`. Quan trọng nhất là:

- Toàn bộ yêu cầu đồ án trong `@Exercise.md` (Đặc biệt tập trung vào Phần 3).
- Lược đồ kiến trúc `@docs/Part2/Architecture.puml`.
- Thiết kế cơ sở dữ liệu `@docs/Part2/Schema.puml`.

**System Rules & Backend "Taste-Skill":**
Đóng vai là một Senior Node.js Architect. Tôi cần bạn viết code Backend không chỉ chạy được mà phải thể hiện **"Good Taste" (Tính thẩm mỹ trong mã nguồn):**

1. **Modern ES6+ & Typings:** Viết code hiện đại. Nếu dùng JS thuần, BẮT BUỘC dùng JSDoc đầy đủ để định nghĩa cấu trúc Request/Response và Model (giả lập Interface). Không dùng biến chung chung.
2. **Clean Architecture:** Tách biệt rõ ràng Route, Controller và Service/Database Logic. Không nhồi nhét tất cả vào một file `server.js`.
3. **Graceful Error Handling:** Không bao giờ để server crash vì lỗi DB. Mọi route phải có khối try/catch. Trả về mã lỗi HTTP chuẩn (400, 404, 500) kèm JSON message rõ ràng.
4. **Self-Documenting:** Đặt tên biến, tên hàm rõ nghĩa đến mức không cần đọc comment cũng hiểu code làm gì.

**Nhiệm vụ (Chỉ làm Phần 3 của đề bài):**

- **Nhiệm vụ 3.1 - Code 3 API Endpoints (Node.js/Express + MySQL2):**
- Tạo file thiết lập kết nối Database (dùng connection pool của `mysql2/promise`). Hãy map đúng các trường như `available_qty`, `category_id` từ file `Schema.puml`.
- Viết code cho `GET /api/books` (Hỗ trợ query phân trang `page`, `limit` và lọc `category_id`).
- Viết code cho `POST /api/borrow` (Có transaction. Kiểm tra `available_qty > 0` trước khi cho mượn, thành công thì trừ đi 1).
- Viết code cho `GET /api/users/:id/borrows` (Dùng JOIN để lấy tên sách thay vì chỉ trả về book_id).

- **Nhiệm vụ 3.2 - Refactor Code Java Cũ:**
- Đọc phần "Ví dụ chức năng đăng nhập" ở cuối file `@Exercise.md`.
- Đưa ra bản refactor hoàn thiện. Phải tách logic ra, fix SQL Injection, và xóa code trùng lặp. Giải thích 3 gạch đầu dòng về lý do thay đổi.

**Constraint:** KHÔNG đụng đến Phần 4 (Review Code) và Phần 5 (Testing). Chỉ xuất ra cấu trúc thư mục Node.js và nội dung mã nguồn của các file cần thiết.
