VPT Mart – Website Thương mại điện tử
* Giới thiệu
VPT Mart là hệ thống website thương mại điện tử hỗ trợ người dùng mua sắm trực tuyến một cách tiện lợi.
Hệ thống cho phép đăng ký, đăng nhập, xem sản phẩm, quản lý giỏ hàng, đặt hàng và tương tác qua đánh giá, bình luận.
Dự án được phát triển theo mô hình full-stack với ReactJS (frontend) và Node.js (backend).
* Chức năng chính
- Người dùng
Đăng ký tài khoản và xác thực email
Đăng nhập / đăng xuất باستخدام JWT
Xem danh sách sản phẩm theo danh mục
Xem chi tiết sản phẩm
Thêm / xóa / cập nhật giỏ hàng
Đặt hàng
Đánh giá sản phẩm (chỉ khi đã mua)
Bình luận sản phẩm
- Quản trị viên (Admin)
Quản lý sản phẩm (CRUD)
Quản lý người dùng
Quản lý đơn hàng
Thống kê hệ thống
* Công nghệ sử dụng
- Frontend
ReactJS
Ant Design
Styled-components
Axios
- Backend
Node.js (ExpressJS)
MongoDB (Mongoose)
JSON Web Token (JWT)
Bcrypt
* Kiến trúc hệ thống
Thiết kế theo mô hình RESTful API
Áp dụng mô hình MVC kết hợp Service Layer
Tách riêng frontend và backend
Sử dụng middleware cho xác thực và phân quyền
* Xác thực và phân quyền
Sử dụng JWT để xác thực người dùng
Phân quyền theo vai trò (User / Admin)
Bảo vệ route bằng middleware
* Thiết kế API
Tuân theo chuẩn RESTful
Sử dụng các phương thức: GET, POST, PUT, DELETE
Dữ liệu trao đổi dưới dạng JSON
