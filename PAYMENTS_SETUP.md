# Đăng ký thanh toán cho nhóm EXE202

Hiện tại nhóm chưa có khóa thanh toán. Các API tích hợp đã có trong backend, nhưng chưa thể kiểm thử hoặc bật giao dịch tiền thật. Giữ `COMMERCE_MODE=demo` và `LIVE_PAYMENTS_ENABLED=false` khi trình diễn dữ liệu mẫu.

## payOS

1. Đăng ký tại https://my.payos.vn và xác thực cá nhân hoặc doanh nghiệp theo hướng dẫn của payOS.
2. Tạo kênh thanh toán, liên kết tài khoản ngân hàng theo các lựa chọn được nhà cung cấp hỗ trợ.
3. Lấy Client ID, API Key, Checksum Key; điền vào `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` trong Environment Variables của Vercel. Không gửi khóa vào chat hoặc commit Git.
4. Đặt `APP_URL` bằng tên miền HTTPS sau khi deploy. Cấu hình webhook của kênh thành `https://TEN-MIEN/api/payments/payos/webhook`.
5. Trước khi bật live, cấu hình cửa hàng nhận đơn, giá và tồn kho thật qua phần quản trị/backend. Sau đó dùng `COMMERCE_MODE=live`, `LIVE_PAYMENTS_ENABLED=true`, redeploy và kiểm thử giao dịch với sự đồng ý của chủ tài khoản. MongoDB live cần hỗ trợ transaction (replica set, ví dụ Atlas).

Nguồn: https://payos.vn/docs/du-lieu-tra-ve/webhook/

## MoMo

1. Đăng ký MoMo Business tại https://business.momo.vn, chọn giải pháp thanh toán và kiểm tra điều kiện hồ sơ với MoMo. Ví cá nhân không thay thế bộ khóa API dành cho merchant.
2. Lấy khóa test để tích hợp sandbox; hoàn thành kiểm thử và gửi kết quả cho MoMo.
3. Hoàn tất xác minh, yêu cầu khóa production và quy trình UAT/duyệt triển khai của MoMo. Nhóm sinh viên cần được MoMo xác nhận đủ điều kiện; không mặc định tài khoản test có thể thu tiền thật.
4. Cấu hình `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY` bằng khóa production trên Vercel, đặt `MOMO_ENV=production`. Các điều kiện live ở phần payOS cũng áp dụng.
5. Backend gửi IPN URL `https://TEN-MIEN/api/payments/momo/webhook`. Kiểm tra webhook, số tiền và trạng thái đơn sau thanh toán; trang chuyển hướng thành công không phải bằng chứng đã nhận tiền.

Nguồn: https://developers.momo.vn/v3/docs/payment/onboarding/integration-process/

## Dữ liệu và triển khai

Danh mục hiện có 30 món và 20 ưu đãi minh họa. Đây không phải giá/khuyến mãi chính thức hoặc đơn được chuyển đến Bách Hóa Xanh/WinMart. Ảnh món ăn và Deals dạng WebP lưu trong `public/images/food` (ảnh chụp có nguồn và ảnh AI minh họa; xem credits.html); ảnh nguyên liệu phụ lưu trong `public/images/catalog`, MongoDB lưu đường dẫn ảnh. Đẩy cả thư mục ảnh lên Git khi deploy.

Vercel không truy cập được MongoDB localhost trên máy bạn. Tạo MongoDB Atlas, đặt `MONGODB_URI` trên Vercel; để nạp danh mục, chạy `npm run catalog:seed` với URI của database đích trong môi trường local được bảo vệ. Script thêm/cập nhật ảnh, không xóa tài khoản hoặc đơn hàng. Không chạy script seed khác nếu chưa kiểm tra khả năng ghi đè dữ liệu.

## QR ngay trong website

Sau khi chọn QR ngân hàng · payOS và đặt đơn, khách được đưa đến `/payment/<mã đơn>` trên website. Trang hiển thị QR do payOS trả về, số tiền, người nhận, tài khoản và nội dung chuyển khoản. Có nút sao chép, kiểm tra trạng thái và mở trang payOS khi cần. QR được tạo theo đơn, không dùng ảnh QR cố định.

Phiên mới có thời hạn 30 phút. Trang kiểm tra giao dịch mỗi 15 giây khi đang được mở; webhook vẫn hoạt động khi khách đóng trang. Chỉ trạng thái đã được backend xác minh mới hiển thị thành công. Đơn cần đối soát, đã hủy hoặc hết hạn có thông báo riêng. Phiên cũ không lưu QR có liên kết mở payOS để tiếp tục.

Cần deploy cả code và dependency mới, cấu hình khóa payOS hiện hành trên Vercel, webhook và dữ liệu nhận đơn trước khi thử giao dịch thật. Không sử dụng lại khóa đã được chia sẻ công khai. Chưa có giao dịch tiền thật nào được thực hiện trong quá trình xây dựng giao diện này.
