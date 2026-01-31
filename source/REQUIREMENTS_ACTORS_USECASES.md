# Tổng Hợp Yêu Cầu và Use Case Hệ Thống

Dưới đây là các bảng tổng hợp yêu cầu, tác nhân và danh sách use case của hệ thống Livana.

## 1. Bảng "Danh sách các yêu cầu"

| STT | Nhóm chức năng | Phân rã | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | Xác thực & Quản lý người dùng | - Đăng ký tài khoản<br>- Đăng nhập<br>- Quên mật khẩu<br>- Đăng xuất | Các chức năng liên quan đến việc tạo lập, truy cập và bảo mật tài khoản người dùng vào hệ thống. |
| 2 | Hồ sơ & Cá nhân hóa | - Cập nhật hồ sơ<br>- Quản lý sở thích<br>- Thêm vào yêu thích (Wishlist) | Cho phép người dùng quản lý thông tin cá nhân và lưu trữ các mục quan tâm. |
| 3 | Quản lý Nhà cho thuê (Host) | - Tạo nhà mới<br>- Cập nhật thông tin nhà<br>- Xóa/Ẩn nhà | Cung cấp công cụ cho Chủ nhà (Host) đăng tải và quản lý các tài sản cho thuê của mình. |
| 4 | Quản lý Trải nghiệm (Host) | - Tạo trải nghiệm mới<br>- Lên lịch (Session)<br>- Quản lý danh mục (Admin) | Hỗ trợ Host tổ chức các tour hoặc hoạt động trải nghiệm, quản lý khung thời gian tổ chức. |
| 5 | Tìm kiếm & Khám phá | - Tìm kiếm nhà<br>- Tìm kiếm trải nghiệm<br>- Xem chi tiết Listing | Giúp khách hàng (Guest) dễ dàng tìm thấy nơi ở hoặc hoạt động phù hợp với nhu cầu. |
| 6 | Đặt phòng & Thanh toán | - Đặt phòng (Book Home)<br>- Đặt trải nghiệm<br>- Thêm phương thức thanh toán<br>- Hủy đặt phòng | Quy trình cốt lõi cho phép khách hàng thực hiện giao dịch đặt chỗ và thanh toán. |
| 7 | Quản lý Booking (Host) | - Duyệt/Từ chối yêu cầu<br>- Xem doanh thu/Dashboard<br>- Yêu cầu rút tiền | Các công cụ giúp Host quản lý các yêu cầu đặt phòng từ khách và theo dõi thu nhập tài chính. |
| 8 | Tương tác cộng đồng | - Viết đánh giá (Review)<br>- Gửi/Nhận tin nhắn<br>- Xem thông báo<br>- Báo cáo vi phạm | Tăng cường sự tin cậy và giao tiếp giữa các người dùng trong hệ thống. |
| 9 | Quản trị hệ thống (Admin) | - Quản lý người dùng<br>- Quản lý tiện ích<br>- Quản lý loại phòng<br>- Quản lý danh mục | Các chức năng dành riêng cho Admin để vận hành và duy trì dữ liệu nền tảng của hệ thống. |

---

## 2. Bảng "Danh sách tác nhân"

| STT | Mã Actor | Tên Actor | Mô tả (Các tính năng thực hiện) |
| :--- | :--- | :--- | :--- |
| 1 | **GUEST** | Khách vãng lai | Người dùng chưa đăng nhập hoặc mới truy cập.<br>- Đăng ký tài khoản mới.<br>- Tìm kiếm và xem thông tin cơ bản (thường bị hạn chế một số tính năng). |
| 2 | **USER** | Người dùng (Guest) | Người dùng đã đăng nhập vào hệ thống.<br>- Đăng nhập, Đăng xuất, Quên mật khẩu.<br>- Cập nhật hồ sơ, Quản lý sở thích.<br>- Tìm kiếm, Xem chi tiết, Đặt phòng/Trải nghiệm.<br>- Hủy đặt phòng, Viết đánh giá.<br>- Nhắn tin, Xem thông báo, Báo cáo vi phạm.<br>- Thêm thanh toán, Xem lịch sử giao dịch.<br>- Đăng ký trở thành Host. |
| 3 | **HOST** | Chủ nhà | Người dùng có quyền cho thuê nhà/tổ chức trải nghiệm.<br>- Bao gồm tất cả quyền của USER.<br>- Tạo/Sửa/Xóa nhà cho thuê.<br>- Tạo trải nghiệm, Lên lịch session.<br>- Duyệt/Từ chối booking.<br>- Xem Dashboard doanh thu, Rút tiền. |
| 4 | **ADMIN** | Quản trị viên | Người quản lý vận hành hệ thống.<br>- Quản lý người dùng (Khóa/Mở).<br>- Quản lý danh mục dữ liệu (Tiện ích, Loại phòng, Danh mục trải nghiệm). |

---

## 3. Bảng "Danh sách Use Case"

| Mã Use Case | Tên Use Case | Mã Actor | Mô tả |
| :--- | :--- | :--- | :--- |
| UC-001 | Đăng Ký Tài Khoản Mới | Guest | Tạo tài khoản mới để tham gia hệ thống. |
| UC-002 | Đăng Nhập | User | Truy cập vào hệ thống với tài khoản đã có. |
| UC-003 | Quên Mật Khẩu | User | Khôi phục mật khẩu qua email. |
| UC-004 | Cập Nhật Hồ Sơ Người Dùng | User | Chỉnh sửa thông tin cá nhân và ảnh đại diện. |
| UC-005 | Quản Lý Sở Thích | User | Chọn các chủ đề quan tâm. |
| UC-006 | Tạo Mới Nhà Cho Thuê | Host | Đăng tải một căn nhà mới để cho thuê. |
| UC-007 | Cập Nhật Nhà Cho Thuê | Host | Sửa đổi thông tin của nhà đã đăng. |
| UC-008 | Xóa/Ẩn Nhà Cho Thuê | Host | Gỡ bỏ hoặc ẩn nhà khỏi danh sách tìm kiếm. |
| UC-009 | Tạo Mới Trải Nghiệm | Host | Đăng tải một dịch vụ trải nghiệm mới. |
| UC-010 | Lên Lịch Trải Nghiệm | Host | Tạo các khung giờ (session) cho khách đặt. |
| UC-011 | Tìm Kiếm Nhà | Guest, User | Tìm kiếm nơi ở theo địa điểm, ngày tháng. |
| UC-012 | Tìm Kiếm Trải Nghiệm | Guest, User | Tìm kiếm hoạt động vui chơi giải trí. |
| UC-013 | Xem Chi Tiết Listing | Guest, User | Xem đầy đủ thông tin, ảnh, review của listing. |
| UC-014 | Đặt Phòng (Book Home) | User | Thực hiện đặt phòng cho một khoảng thời gian. |
| UC-015 | Đặt Trải Nghiệm | User | Đặt chỗ tham gia trải nghiệm. |
| UC-016 | Hủy Đặt Phòng | User | Hủy bỏ một booking đã đặt trước đó. |
| UC-017 | Duyệt/Từ Chối Booking | Host | Phản hồi yêu cầu đặt phòng của khách. |
| UC-018 | Xem Doanh Thu & Dashboard | Host | Theo dõi thống kê thu nhập và hoạt động. |
| UC-019 | Viết Đánh Giá | User | Gửi feedback và chấm điểm sau chuyến đi. |
| UC-020 | Gửi Tin Nhắn | User, Host | Trao đổi thông tin qua chat nội bộ. |
| UC-021 | Xem Danh Sách Hội Thoại | User, Host | Xem lại lịch sử các cuộc trò chuyện. |
| UC-022 | Xem Thông Báo | User | Nhận các cập nhật từ hệ thống. |
| UC-023 | Quản Lý Người Dùng | Admin | Khóa hoặc mở khóa tài khoản thành viên. |
| UC-024 | Tạo Tiện Ích Mới | Admin | Thêm các tiện ích vào danh mục chung. |
| UC-025 | Quản Lý Loại Bất Động Sản | Admin | Định nghĩa các loại hình nhà ở. |
| UC-026 | Quản Lý Danh Mục Trải Nghiệm | Admin | Định nghĩa các loại hình trải nghiệm. |
| UC-027 | Thêm Vào Yêu Thích | User | Lưu listing để xem lại sau. |
| UC-028 | Báo Cáo Vi Phạm | User | Báo cáo nội dung xấu lên Admin. |
| UC-029 | Trở Thành Host | User | Đăng ký để kích hoạt quyền Host. |
| UC-030 | Đăng Xuất | User | Thoát khỏi phiên làm việc hiện tại. |
| UC-031 | Thêm Phương Thức Thanh Toán | User | Liên kết thẻ hoặc tài khoản ngân hàng. |
| UC-032 | Yêu Cầu Rút Tiền | Host | Rút tiền từ ví doanh thu về ngân hàng. |
| UC-033 | Xem Lịch Sử Giao Dịch | User | Xem danh sách thanh toán và hoàn tiền. |
