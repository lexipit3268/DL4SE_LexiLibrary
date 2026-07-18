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

# Phần 4

Đóng vai là một Senior Java Developer và chuyên gia bảo mật (Security Expert). Hãy review đoạn mã nguồn LoginServlet.java được cung cấp. Thực hiện các yêu cầu sau:

- Liệt kê ít nhất 4 vấn đề phát hiện được và phân loại chúng theo các nhóm: Bug, Security, Performance, Style.

- Đánh giá mức độ ưu tiên (Critical, High, Medium, Low) cho từng vấn đề.

- Đề xuất cách sửa mã nguồn chi tiết cho 2 vấn đề có mức độ ưu tiên cao nhất.

# Phần 5

**Ngữ cảnh & Dữ liệu đầu vào:**
Hãy đọc các file mã nguồn hiện tại trong thư mục `@src`. Cụ thể, tập trung vào:

1. `@src/services/borrowService.js` (Hàm xử lý logic mượn sách).
2. `@src/controllers/borrowController.js` và `@src/routes/borrowRoutes.js` (Endpoint API mượn sách).
3. `@src/config/db.js` (Cấu hình kết nối MySQL).
4. `@src/app.js` (File khởi tạo Express app, dùng cho Supertest).

**Vai trò & Code Taste:**
Đóng vai là một Senior QA Automation Engineer chuyên viết test cho Node.js backend. Bạn cần viết test code sao cho thật "Clean":

- Sử dụng Jest làm test runner và Supertest để test API.
- Cú pháp ES6+, sử dụng `describe`, `it`, `beforeEach`, `afterAll` rõ ràng.
- Các test case phải độc lập (independent), không phụ thuộc thứ tự chạy.
- Phải có comment ngắn gọn mô tả mục đích của mỗi block test để nộp báo cáo.

**Nhiệm vụ (Chỉ thực hiện Phần 5 của đồ án):**
Hãy sinh ra 2 file test hoàn chỉnh. Không sửa đổi mã nguồn gốc (trừ khi phát hiện lỗi chí mạng ngăn cản việc test).
**Nhiệm vụ 1 (Câu 5.1): Viết Unit Test cho `borrowService**`

- Tạo file: `@tests/unit/borrowService.test.js`
- Sử dụng `jest.mock('../../src/config/db')` để giả lập (mock) toàn bộ các kết nối và truy vấn DB (không gọi DB thật).
- Sử dụng `mockReturnValue` hoặc `mockResolvedValue` để trả về dữ liệu giả cho các trường hợp:

1. **Happy path:** User tồn tại, sách còn sẵn (available_qty > 0) -> Trả về record mượn thành công.
2. **Edge case 1:** Sách đã hết (available_qty = 0) -> Ném lỗi.
3. **Edge case 2:** User không tồn tại -> Ném lỗi. 4. **Edge case 3:** User đang mượn cuốn sách này rồi (Duplicate borrow) -> Ném lỗi.

**Nhiệm vụ 2 (Câu 5.2): Viết Integration Test cho API `POST /api/borrow`**

- Tạo file: `@tests/integration/borrowApi.test.js`
- Import Express app từ `@src/app.js` và dùng thư viện `supertest`.
- Thực hiện mock cơ sở dữ liệu hoặc sử dụng setup/teardown khéo léo để cô lập test. Nếu dùng mock cho middleware xác thực (`authenticate.js`), hãy đảm bảo token giả hoạt động.
- Viết 3 test cases:

1.  **Thành công (201):** Gửi kèm token hợp lệ, payload đúng -> Assert HTTP status 201 và response body có chứa thông tin mượn.
2.  **Không có token (401):** Gửi request không có Header `Authorization` -> Assert HTTP status 401. 3. **Sách hết (400):** Gửi request hợp lệ nhưng mock DB trả về hết sách -> Assert HTTP status 400.

    **Output yêu cầu:** Sinh ra mã nguồn đầy đủ của 2 file test trên. Đảm bảo có thể chạy lệnh `npx jest` và pass ngay lập tức.

---

### Lưu ý nhỏ trước khi chạy:

Vì chúng ta sẽ dùng **Jest** và **Supertest**, bạn cần đảm bảo đã cài đặt 2 thư viện này vào môi trường dev của dự án. Mở terminal tại thư mục gốc và chạy lệnh sau (nếu chưa cài):

```bash
pnpm add -D jest supertest

```

Ngoài ra, bạn cần thêm script chạy test vào file `package.json` (AI IDE có thể sẽ tự làm việc này, nhưng nếu không, bạn bổ sung thủ công dòng này vào mục `"scripts"`):

```json
"test": "jest --detectOpenHandles"
```
