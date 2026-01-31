# Các Use Case Hệ Thống Livana

Dưới đây là danh sách chi tiết 30 use case quan trọng cho hệ thống Livana.

## Xác Thực & Quản Lý Người Dùng

### UC-001: Đăng Ký Tài Khoản Mới
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-001 |
| **Tên Use Case** | Đăng Ký Tài Khoản Mới |
| **Mô Tả** | Cho phép người dùng mới tạo tài khoản trong hệ thống. |
| **Tác Nhân** | Khách (Guest) |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Người dùng nhấn nút "Đăng Ký". |
| **Tiền Điều Kiện** | Người dùng chưa đăng nhập. |
| **Hậu Điều Kiện** | Tài khoản mới được tạo và lưu trong CSDL. Trạng thái hoạt động/chờ xác thực email. |
| **Luồng Cơ Bản** | 1. Người dùng nhập email, tên đăng nhập và mật khẩu.<br>2. Hệ thống kiểm tra dữ liệu.<br>3. Hệ thống tạo tài khoản.<br>4. Hệ thống thông báo thành công. |
| **Luồng Thay Thế** | 1. Đăng ký qua Google/Facebook.<br>2. Hệ thống tạo tài khoản liên kết với bên thứ 3. |
| **Luồng Ngoại Lệ** | 1. Email đã tồn tại: Hệ thống báo lỗi.<br>2. Mật khẩu không đúng định dạng: Hệ thống báo lỗi. |

### UC-002: Đăng Nhập
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-002 |
| **Tên Use Case** | Đăng Nhập |
| **Mô Tả** | Cho phép người dùng đã có tài khoản truy cập vào hệ thống. |
| **Tác Nhân** | Người Dùng (User) |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Người dùng nhấn nút "Đăng Nhập". |
| **Tiền Điều Kiện** | Người dùng đã có tài khoản. |
| **Hậu Điều Kiện** | Người dùng được xác thực và chuyển hướng đến trang chủ/dashboard. |
| **Luồng Cơ Bản** | 1. Người dùng nhập tài khoản/mật khẩu.<br>2. Hệ thống xác thực.<br>3. Hệ thống tạo JWT/Session.<br>4. Hệ thống chuyển hướng người dùng. |
| **Luồng Thay Thế** | 1. Đăng nhập qua Mạng Xã Hội. |
| **Luồng Ngoại Lệ** | 1. Sai mật khẩu/tên đăng nhập: Báo lỗi.<br>2. Tài khoản bị khóa: Báo lỗi cụ thể. |

### UC-003: Quên Mật Khẩu
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-003 |
| **Tên Use Case** | Quên Mật Khẩu |
| **Mô Tả** | Cho phép người dùng đặt lại mật khẩu qua email nếu bị quên. |
| **Tác Nhân** | Người Dùng |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Người dùng nhấn "Quên Mật Khẩu". |
| **Tiền Điều Kiện** | Không có. |
| **Hậu Điều Kiện** | Người dùng có mật khẩu mới. |
| **Luồng Cơ Bản** | 1. Người dùng nhập email.<br>2. Hệ thống gửi link/token reset.<br>3. Người dùng vào link và nhập mật khẩu mới.<br>4. Hệ thống cập nhật mật khẩu. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Email không tồn tại: Thông báo chung (bảo mật).<br>2. Token hết hạn: Yêu cầu lấy token mới. |

### UC-004: Cập Nhật Hồ Sơ
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-004 |
| **Tên Use Case** | Cập Nhật Hồ Sơ Người Dùng |
| **Mô Tả** | Người dùng cập nhật thông tin cá nhân, ảnh đại diện, tiểu sử. |
| **Tác Nhân** | Người Dùng |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Người dùng vào Cài Đặt Hồ Sơ. |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Thông tin được cập nhật trong CSDL. |
| **Luồng Cơ Bản** | 1. Người dùng sửa thông tin (Tên, SĐT, Bio, Avatar).<br>2. Nhấn Lưu.<br>3. Hệ thống kiểm tra và cập nhật. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Định dạng file ảnh không hợp lệ.<br>2. Lỗi định dạng số điện thoại. |

### UC-005: Quản Lý Sở Thích
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-005 |
| **Tên Use Case** | Quản Lý Sở Thích |
| **Mô Tả** | Người dùng chọn các chủ đề quan tâm để cá nhân hóa. |
| **Tác Nhân** | Người Dùng |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Người dùng xem phần Sở Thích. |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Sở thích được lưu vào bảng `user_interest`. |
| **Luồng Cơ Bản** | 1. Hệ thống hiển thị danh sách sở thích.<br>2. Người dùng chọn/bỏ chọn.<br>3. Lưu lại.<br>4. Hệ thống cập nhật liên kết. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Lỗi kết nối CSDL. |

---

## Quản Lý Nhà Cho Thuê (Chủ Nhà - Host)

### UC-006: Tạo Mới Nhà Cho Thuê
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-006 |
| **Tên Use Case** | Tạo Mới Nhà Cho Thuê |
| **Mô Tả** | Chủ nhà tạo một listing nhà mới để cho thuê. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Host nhấn "Cho thuê nhà". |
| **Tiền Điều Kiện** | Đã đăng nhập, đã xác thực danh tính (nếu cần). |
| **Hậu Điều Kiện** | Listing mới được tạo trong `home_listing` và `base_listing`. |
| **Luồng Cơ Bản** | 1. Host nhập thông tin (Tiêu đề, Giá, Địa chỉ, Tiện ích, Ảnh).<br>2. Lưu nháp hoặc Đăng.<br>3. Hệ thống xác nhận tạo thành công. |
| **Luồng Thay Thế** | 1. Lưu nháp để hoàn thiện sau. |
| **Luồng Ngoại Lệ** | 1. Thiếu thông tin bắt buộc.<br>2. Lỗi tải ảnh lên. |

### UC-007: Cập Nhật Nhà Cho Thuê
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-007 |
| **Tên Use Case** | Cập Nhật Nhà Cho Thuê |
| **Mô Tả** | Chủ nhà sửa đổi thông tin nhà đã đăng. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Host chọn nhà cần sửa. |
| **Tiền Điều Kiện** | Host sở hữu listing đó. |
| **Hậu Điều Kiện** | Thông tin listing được cập nhật. |
| **Luồng Cơ Bản** | 1. Host sửa các trường (Giá, Mô tả...).<br>2. Host lưu lại.<br>3. Hệ thống cập nhật CSDL. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Lỗi dữ liệu (ví dụ: giá âm). |

### UC-008: Xóa/Ẩn Nhà Cho Thuê
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-008 |
| **Tên Use Case** | Xóa Nhà Cho Thuê |
| **Mô Tả** | Chủ nhà gỡ bỏ hoặc tạm ẩn nhà khỏi danh sách tìm kiếm. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Host chọn xóa listing. |
| **Tiền Điều Kiện** | Host sở hữu listing. Không có đặt phòng nào đang hoạt động. |
| **Hậu Điều Kiện** | Listing bị xóa mềm (soft-delete) hoặc chuyển trạng thái ẩn. |
| **Luồng Cơ Bản** | 1. Host yêu cầu xóa.<br>2. Hệ thống kiểm tra booking tương lai.<br>3. Xác nhận xóa.<br>4. Hệ thống xóa mềm bản ghi. |
| **Luồng Thay Thế** | 1. Ẩn (Deactivate) thay vì xóa hẳn. |
| **Luồng Ngoại Lệ** | 1. Không thể xóa do đang có khách đặt trong tương lai. |

---

## Quản Lý Trải Nghiệm (Host)

### UC-009: Tạo Mới Trải Nghiệm
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-009 |
| **Tên Use Case** | Tạo Mới Trải Nghiệm |
| **Mô Tả** | Host tạo dịch vụ trải nghiệm/tour du lịch. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Host nhấn "Tổ chức trải nghiệm". |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Listing trải nghiệm được tạo. |
| **Luồng Cơ Bản** | 1. Host nhập Tiêu đề, Loại hình, Giá, Thời lượng, Địa điểm.<br>2. Hệ thống kiểm tra.<br>3. Listing được đăng. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Dữ liệu loại hình không hợp lệ. |

### UC-010: Lên Lịch Trải Nghiệm (Session)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-010 |
| **Tên Use Case** | Lên Lịch Trải Nghiệm |
| **Mô Tả** | Host tạo các khung giờ (sessions) cho trải nghiệm. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Host quản lý lịch trình. |
| **Tiền Điều Kiện** | Đã có listing trải nghiệm. |
| **Hậu Điều Kiện** | Tạo bản ghi mới trong `experience_session`. |
| **Luồng Cơ Bản** | 1. Host chọn Ngày/Giờ và Số khách tối đa.<br>2. Xác nhận.<br>3. Hệ thống tạo session trống. |
| **Luồng Thay Thế** | 1. Tạo lịch lặp lại hàng tuần. |
| **Luồng Ngoại Lệ** | 1. Trùng lịch với session đã có (cảnh báo). |

---

## Tìm Kiếm & Đặt Phòng (Khách - Guest)

### UC-011: Tìm Kiếm Nhà
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-011 |
| **Tên Use Case** | Tìm Kiếm Nhà |
| **Mô Tả** | Khách tìm nơi ở dựa trên các tiêu chí. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Khách dùng thanh tìm kiếm. |
| **Tiền Điều Kiện** | Không có. |
| **Hậu Điều Kiện** | Danh sách nhà phù hợp được hiển thị. |
| **Luồng Cơ Bản** | 1. Nhập Địa điểm, Ngày, Số khách.<br>2. Hệ thống truy vấn CSDL.<br>3. Trả về kết quả list/map. |
| **Luồng Thay Thế** | 1. Dùng bộ lọc nâng cao (Giá, Tiện ích). |
| **Luồng Ngoại Lệ** | 1. Không tìm thấy kết quả nào. |

### UC-012: Tìm Kiếm Trải Nghiệm
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-012 |
| **Tên Use Case** | Tìm Kiếm Trải Nghiệm |
| **Mô Tả** | Khách tìm các hoạt động vui chơi. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Khách chuyển tab sang Trải Nghiệm. |
| **Tiền Điều Kiện** | Không có. |
| **Hậu Điều Kiện** | Danh sách trải nghiệm phù hợp hiển thị. |
| **Luồng Cơ Bản** | 1. Nhập Loại hình/Địa điểm/Ngày.<br>2. Hệ thống truy vấn.<br>3. Trả về kết quả. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Không có kết quả. |

### UC-013: Xem Chi Tiết Listing
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-013 |
| **Tên Use Case** | Xem Chi Tiết Listing |
| **Mô Tả** | Khách xem thông tin đầy đủ của nhà hoặc trải nghiệm. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Khách nhấn vào thẻ kết quả tìm kiếm. |
| **Tiền Điều Kiện** | Listing tồn tại và đang hoạt động. |
| **Hậu Điều Kiện** | Trang chi tiết được hiển thị. |
| **Luồng Cơ Bản** | 1. Hệ thống lấy chi tiết, ảnh, review, thông tin host.<br>2. Hiển thị trang. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Listing đã bị xóa/ẩn (Lỗi 404). |

### UC-014: Đặt Phòng (Book Home)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-014 |
| **Tên Use Case** | Đặt Phòng |
| **Mô Tả** | Khách gửi yêu cầu đặt phòng. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Khách nhấn "Đặt phòng" tại trang chi tiết. |
| **Tiền Điều Kiện** | Đã đăng nhập, lịch còn trống. |
| **Hậu Điều Kiện** | Booking được tạo trong `booking`, `home_booking` với trạng thái PENDING/CONFIRMED. |
| **Luồng Cơ Bản** | 1. Xác nhận Ngày và Số khách.<br>2. Hệ thống tính tổng tiền.<br>3. Khách thanh toán.<br>4. Tạo booking.<br>5. Thông báo cho Host. |
| **Luồng Thay Thế** | 1. Đặt ngay (Tự động xác nhận).<br>2. Gửi yêu cầu (Cần Host duyệt). |
| **Luồng Ngoại Lệ** | 1. Thanh toán thất bại.<br>2. Lịch bị người khác đặt cùng lúc. |

### UC-015: Đặt Trải Nghiệm
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-015 |
| **Tên Use Case** | Đặt Trải Nghiệm |
| **Mô Tả** | Khách đặt chỗ cho một buổi trải nghiệm. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Nhấn "Đặt chỗ" tại trang Trải Nghiệm. |
| **Tiền Điều Kiện** | Đã đăng nhập, Session còn chỗ. |
| **Hậu Điều Kiện** | Tạo `experience_booking`, cập nhật số lượng khách. |
| **Luồng Cơ Bản** | 1. Chọn Ngày/Giờ và Số lượng.<br>2. Kiểm tra chỗ trống.<br>3. Thanh toán.<br>4. Xác nhận đặt chỗ. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Hết chỗ (Full). |

### UC-016: Hủy Đặt Phòng/Chỗ
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-016 |
| **Tên Use Case** | Hủy Đặt Phòng |
| **Mô Tả** | Khách hủy chuyến đi sắp tới. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Chọn "Hủy" trong danh sách Chuyến đi. |
| **Tiền Điều Kiện** | Booking đang active và chưa diễn ra. |
| **Hậu Điều Kiện** | Trạng thái = CANCELLED, Ngày được giải phóng. |
| **Luồng Cơ Bản** | 1. Yêu cầu hủy.<br>2. Hệ thống tính tiền hoàn lại theo chính sách.<br>3. Cập nhật trạng thái.<br>4. Hoàn tiền. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Không được hủy (quá sát ngày). |

---

## Quản Lý Đặt Phòng (Host)

### UC-017: Duyệt/Từ Chối Yêu Cầu
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-017 |
| **Tên Use Case** | Duyệt/Từ Chối Booking |
| **Mô Tả** | Host chấp nhận hoặc từ chối yêu cầu đặt phòng chờ duyệt. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Host xem yêu cầu đang chờ (Pending). |
| **Tiền Điều Kiện** | Booking trạng thái PENDING. |
| **Hậu Điều Kiện** | Trạng thái thành CONFIRMED hoặc CANCELLED. |
| **Luồng Cơ Bản** | 1. Xem hồ sơ khách và ngày đặt.<br>2. Nhấn Duyệt hoặc Từ chối.<br>3. Cập nhật trạng thái.<br>4. Khách nhận thông báo. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Yêu cầu hết hạn (timeout). |

### UC-018: Xem Thống Kê Doanh Thu
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-018 |
| **Tên Use Case** | Xem Doanh Thu & Dashboard |
| **Mô Tả** | Host xem báo cáo thu nhập và thống kê. |
| **Tác Nhân** | Host |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Vào Dashboard Host. |
| **Tiền Điều Kiện** | Là Host. |
| **Hậu Điều Kiện** | Hiển thị biểu đồ/số liệu. |
| **Luồng Cơ Bản** | 1. Hệ thống tổng hợp dữ liệu booking và tiền.<br>2. Hiển thị lên giao diện. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

---

## Đánh Giá & Nhắn Tin

### UC-019: Viết Đánh Giá (Review)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-019 |
| **Tên Use Case** | Viết Đánh Giá |
| **Mô Tả** | Khách đánh giá sau chuyến đi. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Chuyến đi hoàn tất. |
| **Tiền Điều Kiện** | Booking đã xong, trong thời hạn review. |
| **Hậu Điều Kiện** | Lưu bản ghi vào bảng `review`. |
| **Luồng Cơ Bản** | 1. Chấm điểm (1-5 sao) và viết bình luận.<br>2. Hệ thống lưu lại.<br>3. Công khai review (sau khi host cũng review hoặc hết giờ). |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Phát hiện từ ngữ thô tục (nếu có bộ lọc). |

### UC-020: Gửi Tin Nhắn
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-020 |
| **Tên Use Case** | Gửi Tin Nhắn |
| **Mô Tả** | Người dùng trao đổi qua hệ thống chat. |
| **Tác Nhân** | User (Guest/Host) |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Nhập tin nhắn và gửi. |
| **Tiền Điều Kiện** | Đã có hội thoại hoặc bắt đầu mới. |
| **Hậu Điều Kiện** | Lưu tin nhắn vào `message`, cập nhật `conversation`. |
| **Luồng Cơ Bản** | 1. Nhập text/ảnh.<br>2. Nhấn gửi.<br>3. Hệ thống lưu tin.<br>4. Thông báo người nhận (Socket/Push). |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Gửi lỗi. |

### UC-021: Xem Danh Sách Tin Nhắn
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-021 |
| **Tên Use Case** | Xem Danh Sách Hội Thoại |
| **Mô Tả** | Người dùng xem các cuộc trò chuyện của mình. |
| **Tác Nhân** | User |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Mở Hộp thư (Inbox). |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Hiển thị list hội thoại. |
| **Luồng Cơ Bản** | 1. Truy vấn bảng `conversation`.<br>2. Sắp xếp theo tin mới nhất.<br>3. Hiển thị. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-022: Xem Thông Báo
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-022 |
| **Tên Use Case** | Xem Thông Báo |
| **Mô Tả** | Người dùng kiểm tra các thông báo hệ thống. |
| **Tác Nhân** | User |
| **Độ Ưu Tiên** | Trung Bình |
| **Kích Hoạt** | Nhấn biểu tượng Chuông. |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Hiển thị thông báo chưa đọc/đã đọc. |
| **Luồng Cơ Bản** | 1. Lấy dữ liệu từ bảng `notification`.<br>2. Hiển thị tiêu đề/nội dung.<br>3. Đánh dấu đã đọc khi click. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

---

## Quản Trị Hệ Thống (Admin)

### UC-023: Quản Lý Người Dùng (Admin)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-023 |
| **Tên Use Case** | Quản Lý Người Dùng |
| **Mô Tả** | Admin khóa hoặc mở khóa tài khoản thành viên. |
| **Tác Nhân** | Admin |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Vào danh sách User. |
| **Tiền Điều Kiện** | Quyền Admin. |
| **Hậu Điều Kiện** | Trạng thái user thay đổi (VD: Cấm). |
| **Luồng Cơ Bản** | 1. Tìm user.<br>2. Đổi trạng thái (Ban/Unban).<br>3. Cập nhật bảng `user`. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-024: Quản Lý Tiện Ích (Amenity)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-024 |
| **Tên Use Case** | Tạo Tiện Ích Mới |
| **Mô Tả** | Admin thêm các tiện ích (Wifi, Bể bơi...) vào hệ thống. |
| **Tác Nhân** | Admin |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Vào Master Data > Amenities. |
| **Tiền Điều Kiện** | Quyền Admin. |
| **Hậu Điều Kiện** | Tiện ích mới trong bảng `amenity`. |
| **Luồng Cơ Bản** | 1. Nhập tên và icon.<br>2. Lưu lại. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | 1. Trùng tên. |

### UC-025: Quản Lý Loại Phòng/Nhà
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-025 |
| **Tên Use Case** | Quản Lý Loại Bất Động Sản |
| **Mô Tả** | Admin định nghĩa các loại như Căn hộ, Nhà riêng, Biệt thự. |
| **Tác Nhân** | Admin |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Vào Property Types. |
| **Tiền Điều Kiện** | Quyền Admin. |
| **Hậu Điều Kiện** | Bảng `property_type` được cập nhật. |
| **Luồng Cơ Bản** | 1. Thêm/Sửa loại nhà.<br>2. Cập nhật CSDL. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-026: Quản Lý Danh Mục Trải Nghiệm
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-026 |
| **Tên Use Case** | Quản Lý Danh Mục Trải Nghiệm |
| **Mô Tả** | Admin tạo danh mục (Nghệ thuật, Thể thao, Ẩm thực). |
| **Tác Nhân** | Admin |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Vào Categories. |
| **Tiền Điều Kiện** | Quyền Admin. |
| **Hậu Điều Kiện** | Cập nhật `experience_category`. |
| **Luồng Cơ Bản** | 1. Tạo danh mục.<br>2. Lưu lại. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

---

## Khác

### UC-027: Thêm Vào Yêu Thích (Wishlist)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-027 |
| **Tên Use Case** | Thêm Vào Yêu Thích |
| **Mô Tả** | Khách lưu lại nhà để xem sau. |
| **Tác Nhân** | Guest |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Nhấn biểu tượng Trái tim. |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | Tạo liên kết lưu trữ. |
| **Luồng Cơ Bản** | 1. Nhấn tim.<br>2. Hệ thống đổi trạng thái đã lưu. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-028: Báo Cáo Vi Phạm (Report)
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-028 |
| **Tên Use Case** | Báo Cáo Vi Phạm |
| **Mô Tả** | Người dùng báo cáo nội dung không phù hợp. |
| **Tác Nhân** | User |
| **Độ Ưu Tiên** | Thấp |
| **Kích Hoạt** | Nhấn nút Báo cáo (Cờ). |
| **Tiền Điều Kiện** | Không có. |
| **Hậu Điều Kiện** | Tạo bản ghi báo cáo để Admin duyệt. |
| **Luồng Cơ Bản** | 1. Chọn lý do.<br>2. Admin nhận thông báo. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-029: Đăng Ký Làm Host
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-029 |
| **Tên Use Case** | Trở Thành Host |
| **Mô Tả** | Người dùng thường kích hoạt tính năng Host. |
| **Tác Nhân** | User |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Nhấn "Switch to Hosting". |
| **Tiền Điều Kiện** | Đã đăng nhập. |
| **Hậu Điều Kiện** | User được cấp quyền Host. |
| **Luồng Cơ Bản** | 1. Đồng ý điều khoản.<br>2. Cập nhật quyền.<br>3. Chuyển đến Dashboard Host. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |

### UC-030: Đăng Xuất
| Thuộc Tính | Chi Tiết |
| :--- | :--- |
| **Mã Use Case** | UC-030 |
| **Tên Use Case** | Đăng Xuất |
| **Mô Tả** | Kết thúc phiên làm việc. |
| **Tác Nhân** | User |
| **Độ Ưu Tiên** | Cao |
| **Kích Hoạt** | Nhấn Đăng xuất. |
| **Tiền Điều Kiện** | Đang đăng nhập. |
| **Hậu Điều Kiện** | Xóa session, về trang chủ. |
| **Luồng Cơ Bản** | 1. Yêu cầu đăng xuất.<br>2. Hệ thống hủy token.<br>3. Chuyển hướng. |
| **Luồng Thay Thế** | Không có. |
| **Luồng Ngoại Lệ** | Không có. |
