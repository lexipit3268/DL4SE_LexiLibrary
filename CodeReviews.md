**Báo cáo Review:**

### 1. Phân loại và Đánh giá mức độ ưu tiên các vấn đề

| STT | Vấn đề phát hiện                          | Phân loại         | Mức độ ưu tiên  | Mô tả chi tiết                                                                                                                                                                                                 |
| --- | ----------------------------------------- | ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **SQL Injection**                         | Security          | 🔴 **Critical** | Câu lệnh SQL được tạo bằng cách cộng chuỗi trực tiếp (`"SELECT * FROM users WHERE username = '" + username + "'..."`). Kẻ tấn công có thể nhập `admin' OR '1'='1` để bypass đăng nhập dễ dàng.                 |
| 2   | **Lộ lọt tài nguyên (Resource Leak)**     | Bug / Performance | 🟠 **High**     | Các đối tượng `Connection`, `Statement`, và `ResultSet` không được đóng đúng cách. Nếu có ngoại lệ (`Exception`) xảy ra, khối lệnh `conn.close()` sẽ bị bỏ qua, dẫn đến cạn kiệt connection pool của database. |
| 3   | **Mật khẩu lưu dạng Plain text**          | Security          | 🔴 **Critical** | Hệ thống đang so sánh trực tiếp mật khẩu người dùng nhập vào với mật khẩu lưu trong DB mà không qua bất kỳ thuật toán băm (Hash) nào.                                                                          |
| 4   | **Nuốt ngoại lệ (Swallowing Exceptions)** | Bug / Style       | 🟡 **Medium**   | Khối `catch (Exception e)` chỉ in ra chữ "Error" mà không ghi log (log error) chi tiết nguyên nhân lỗi, gây khó khăn cực lớn cho việc debug bảo trì sau này.                                                   |

### 2. Đề xuất cách sửa cho 2 vấn đề nghiêm trọng nhất

**Vấn đề 1: Sửa lỗi SQL Injection (Security - Critical)**

- **Giải pháp:** Bắt buộc sử dụng `PreparedStatement` thay vì `Statement` kết hợp với cộng chuỗi. `PreparedStatement` sẽ tự động escape các ký tự đặc biệt, ngăn chặn triệt để SQL Injection.
- **Mã đề xuất:**

```java
// Thay vì:
// Statement stmt = conn.createStatement();
// String query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
// ResultSet rs = stmt.executeQuery(query);

// Dùng PreparedStatement:
String query = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement pstmt = conn.prepareStatement(query);
pstmt.setString(1, username);
pstmt.setString(2, password);
ResultSet rs = pstmt.executeQuery();

```

**Vấn đề 2: Sửa lỗi Resource Leak bằng Try-with-resources (Bug - High)**

- **Giải pháp:** Cập nhật cú pháp Java từ phiên bản 7 trở lên bằng cách sử dụng `try-with-resources`. Cú pháp này đảm bảo tất cả các tài nguyên giao tiếp với Database (Connection, PreparedStatement, ResultSet) sẽ tự động được đóng lại `close()` ngay cả khi có lỗi xảy ra.
- **Mã đề xuất:**

```java
String query = "SELECT * FROM users WHERE username = ? AND password = ?";

// Đưa việc khởi tạo tài nguyên vào trong ngoặc tròn của try
try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/appdb", "root", "");
     PreparedStatement pstmt = conn.prepareStatement(query)) {

    pstmt.setString(1, username);
    pstmt.setString(2, password);

    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            // Logic đăng nhập thành công
        } else {
            // Logic đăng nhập thất bại
        }
    }
} catch (SQLException e) {
    // Thay vì chỉ in "Error", cần log chi tiết lỗi
    e.printStackTrace();
}

```
