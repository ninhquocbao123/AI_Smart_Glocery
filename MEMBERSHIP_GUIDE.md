# Gói thành viên và giờ vàng

## Quyền lợi
- Miễn phí: 3 lượt chat/ngày; 1 lần tạo thực đơn/tuần, tối đa 1 ngày.
- VIP: 19.000đ/30 ngày; 25 lượt chat/ngày; 5 lần tạo thực đơn/chu kỳ, tối đa 3 ngày; đổi món và tổng hợp danh sách đi chợ.
- VIP Plus: 39.000đ/30 ngày; 50 lượt chat/ngày; 15 lần tạo thực đơn/chu kỳ, tối đa 7 ngày; tủ lạnh, trừ nguyên liệu có sẵn, so sánh giỏ và phân tích chi tiêu.
- Lượt chat đặt lại lúc 00:00 giờ Việt Nam. Tuần miễn phí bắt đầu thứ Hai. Chu kỳ trả phí tính từ thời điểm kích hoạt.
- Đổi món dùng lượt chat. Tạo thực đơn dùng hạn mức riêng. Lỗi AI hoàn lại lượt; câu trả lời hướng dẫn khi AI không khả dụng không tính lượt AI.

## Đường dẫn
- `/membership`: quyền lợi, trạng thái, đăng ký, lịch sử và các giao dịch chờ.
- `/meal-plan/ai`: tạo, lưu, đổi món, tổng hợp danh sách và so sánh.
- `/meal-plan/weekly`: lịch thủ công hiện có, không còn lớp Premium giả lập.
- `/pantry`: thêm/sửa nguyên liệu, cập nhật số lượng đã dùng, xem hạn dùng.
- `/insights`: phân tích đơn thực phẩm đã thanh toán thật; không tính phí đăng ký, đơn hủy hoặc sandbox.
- `/admin/users`: tìm/lọc người dùng, lịch sử cấp gói, cấp/gia hạn/thu hồi với lý do.
- `/admin/golden-hours`: lịch giờ vàng theo giờ Việt Nam và các mã nguyên liệu loại trừ.

## Cấu hình trước khi vận hành
1. MongoDB phải hỗ trợ transaction (Atlas hoặc replica set), như luồng đặt hàng thật hiện có. Chạy `npm run db:prepare` để tạo các index, bao gồm tham chiếu cấp thành viên duy nhất. Không cần sửa tài khoản cũ: mặc định không có gói còn hạn là Miễn phí.
2. Thiết lập `GEMINI_API_KEY` và `GEMINI_MODEL` để tạo thực đơn bằng AI. Không có cấu hình thì báo chưa sẵn sàng và không trừ lượt.
3. Đăng ký trả phí chỉ mở khi `COMMERCE_MODE=live`, `LIVE_PAYMENTS_ENABLED=true`, `APP_URL` HTTPS và cổng thanh toán hiện có được cấu hình. MoMo cần `MOMO_ENV=production`. Không dùng giao dịch sandbox để cấp gói trả phí.
4. Webhook MoMo/payOS tiếp tục dùng đường dẫn cũ. Đơn có `kind=membership` có giá cố định từ máy chủ. Cấp gói có tham chiếu duy nhất và transaction; việc nhận lại webhook không cộng thêm ngày. Nếu cấp gói bị lỗi sau khi thanh toán, webhook hoặc thao tác kiểm tra thanh toán có thể thử lại an toàn.
5. Mua/gia hạn gói nối tiếp mọi gói còn hạn đã mua. Không thu tiền tự động, không quy đổi nâng cấp giữa kỳ. Admin cấp gói được ghi riêng với nguồn thanh toán. Thu hồi không hoàn tiền tự động.

## Giờ vàng
- Mặc định 11:00–13:00 và 17:00–19:00 mỗi ngày, múi giờ Việt Nam.
- Sản phẩm có giá gốc cao hơn giá bán áp dụng giá bán trong giờ vàng, giá gốc ngoài giờ. Mã loại trừ giữ giá bán cả ngày.
- Giá được kiểm tra lại tại bước báo giá/đặt hàng. Trang Deals cập nhật mỗi 30 giây.
- Giá demo được ghi là tham khảo, không phải giá cửa hàng đã xác nhận.

## Phạm vi dữ liệu
- Tủ lạnh do người dùng nhập/cập nhật thủ công. Không tự khẳng định thực phẩm còn an toàn.
- Gộp và trừ nguyên liệu khi tên và đơn vị khớp; không tự suy đoán quy đổi bó/gói sang gram. Danh sách cho phép sửa lượng cần mua.
- So sánh giỏ dùng cùng danh sách và báo giá máy chủ từng cửa hàng; giỏ thiếu giá/tồn kho không được hiển thị như giỏ đầy đủ rẻ hơn. Dữ liệu demo ghi rõ tham khảo.
- Số liệu chi tiêu dựa trên đơn có trong hệ thống. Chưa có quy trình hoàn tiền độc lập; các giao dịch cần đối soát phải được xử lý qua quy trình vận hành hiện có.
- Các hình hội thoại/tủ lạnh trên Landing Page là minh họa, không phải dữ liệu khách hàng hoặc đánh giá thực tế.

## Kiểm tra
- `npm test`: kiểm thử hiện có và bổ sung thời điểm cấp lượt, giới hạn đồng thời, hoàn lượt, giờ vàng và cấp thành viên từ thanh toán.
- `npx tsc --noEmit`: kiểm tra kiểu.
- `npx next build --webpack`: bản build đã kiểm tra; Turbopack gặp lỗi tiến trình CSS trên môi trường Windows hiện tại. Font Inter cần mạng khi build.
- Kiểm tra thanh toán thật cần tài khoản nhà cung cấp và giao dịch thực; chưa thực hiện thu tiền trong quá trình phát triển.

Lưu ý môi trường: công cụ Next.js đã báo cảnh báo bảo mật cho phiên bản đang cài. Cần rà soát và nâng cấp bản vá phù hợp trước khi đưa lên production; lần phát triển này chưa thay đổi phiên bản dependency.
