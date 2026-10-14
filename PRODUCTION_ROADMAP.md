# Lộ trình đưa Smart Grocery từ demo đến vận hành thật

## Hiện trạng

- Đăng ký, đăng nhập, hồ sơ và đơn hàng đã có backend MongoDB.
- Danh mục món, nguyên liệu, giá và ưu đãi còn là dữ liệu mẫu.
- Gợi ý món đang dùng thuật toán lọc theo ngân sách; chưa gọi mô hình AI bên ngoài.
- Thanh toán và giao hàng đang mô phỏng. Đưa website lên hosting chưa đồng nghĩa với có thể nhận tiền và giao hàng thật.
- Budget hiện tính các đơn đã giao/hoàn thành theo ngày đặt; chưa phải sổ giao dịch thanh toán.

## 1. Chốt mô hình bán hàng và nguồn hàng

Khuyến nghị thử với một khu vực gần trường và 1–2 cửa hàng. Cần xác định ai bán hàng, nhận tiền, đóng gói, giao hàng, xử lý thiếu hàng và hoàn tiền. Thống nhất giá, tồn kho, đơn vị tính, phí giao và thời gian xác nhận đơn.

Không mặc định các chuỗi siêu thị có API công khai hoặc đã đồng ý nhận đơn. Chỉ tích hợp khi có quyền truy cập và thỏa thuận. Giai đoạn đầu có thể cho cửa hàng cập nhật qua trang quản trị/CSV, ghi rõ thời điểm cập nhật.

## 2. Hoàn thiện backend và dữ liệu

- Tạo dữ liệu Products, StoreInventory, Recipes, Promotions có mã sản phẩm ổn định, giá theo cửa hàng, tồn kho và hiệu lực ưu đãi.
- Lưu snapshot tên, đơn vị, đơn giá, số lượng và cửa hàng trong Order; thêm phiên bản cấu trúc dữ liệu. Không tính lại tổng tiền lịch sử bằng giá hiện tại.
- Tách paymentStatus khỏi fulfillmentStatus. Thêm Payment/Refund với mã giao dịch duy nhất và nhật ký thay đổi.
- Kiểm tra giá, tồn kho, quyền sở hữu đơn ở server; giữ/trừ tồn kho nhất quán khi nhiều khách cùng mua; chống tạo trùng khi khách bấm lại.
- Trang quản trị có phân quyền khách/cửa hàng/admin, xác nhận đơn và cập nhật giao hàng. Khách không tự chuyển đơn thành đã thanh toán.
- Budget khi chạy thật dựa trên quy tắc giao dịch đã thanh toán và hoàn tiền rõ ràng, kể cả COD; thống nhất dùng ngày thanh toán hay ngày mua.

## 3. Tích hợp một cổng thanh toán

Có thể bắt đầu bằng payOS hoặc MoMo tùy hình thức kinh doanh và điều kiện đăng ký. Nhóm cần tài khoản được nhà cung cấp duyệt, tài khoản nhận tiền và bộ khóa môi trường tương ứng.

Luồng cần xây: server tính tổng → lưu đơn chờ thanh toán → tạo phiên/link thanh toán → khách thanh toán → server nhận webhook/IPN → xác thực chữ ký, mã đơn, số tiền → ghi giao dịch một lần → cập nhật đơn.

Không tin tham số trên trang chuyển hướng thành công. Xử lý webhook gửi lại, đến chậm, sai chữ ký/số tiền, đơn hết hạn, thanh toán sau khi hủy và đối soát khi bỏ lỡ webhook. Hoàn tiền phải có quy trình và người chịu trách nhiệm; khả năng tự động phụ thuộc nhà cung cấp.

Loại bỏ hành động `demoPay` ở API khi vận hành thật. Khóa bí mật chỉ ở server, không đặt trong biến `NEXT_PUBLIC_*`, không đưa lên Git hoặc gửi trong chat. Kiểm thử môi trường thử nghiệm trước khi dùng khóa live.

Tài liệu chính thức:
- [payOS: điều kiện và webhook thanh toán](https://payos.vn/docs/du-lieu-tra-ve/webhook/)
- [MoMo: quy trình tích hợp](https://developers.momo.vn/v3/docs/payment/onboarding/integration-process/)
- [MoMo: xử lý IPN](https://developers.momo.vn/v3/docs/payment/api/result-handling/notification/)

## 4. Dùng AI API thật

Gọi API từ backend. Gửi ngân sách, khẩu phần, sở thích và danh mục món/giá cần thiết; tránh gửi thông tin nhận dạng không cần thiết.

Yêu cầu mô hình trả JSON theo schema, chỉ chọn mã món hợp lệ. Server phải kiểm tra kết quả, tính lại tiền bằng giá trong database, lọc nguyên liệu tránh dùng và món vượt ngân sách. AI không tự quyết định giá hay xác nhận tồn kho. Có giới hạn lượt gọi, timeout, cache, theo dõi chi phí và dùng thuật toán hiện tại khi API lỗi.

[Gemini hỗ trợ structured outputs theo JSON Schema](https://ai.google.dev/gemini-api/docs/structured-output), nhưng dữ liệu trả về vẫn cần kiểm tra về ý nghĩa trước khi sử dụng.

## 5. Triển khai và vận hành

- Chọn hosting hỗ trợ Next.js server/API, tên miền HTTPS và MongoDB riêng cho production; tách dữ liệu phát triển/thử nghiệm.
- Thiết lập secrets, sao lưu và thử khôi phục, giám sát lỗi, cảnh báo webhook thất bại, nhật ký không chứa mật khẩu/API key.
- Bổ sung xác minh email, quên mật khẩu, giới hạn đăng nhập/API, kiểm tra phân quyền, bảo vệ request thay đổi dữ liệu và kiểm thử thanh toán đồng thời.
- Công khai liên hệ hỗ trợ, điều khoản mua hàng, bảo mật và chính sách hủy/hoàn. Xác định thủ tục thương mại điện tử phù hợp mô hình với đơn vị phụ trách; tra cứu tại [cổng Bộ Công Thương](https://online.gov.vn/).

## 6. Có người dùng và kiểm chứng mô hình

Tuyển 20–30 người dùng thử trong một nhóm sinh viên/khu trọ, với phạm vi giao hàng nhỏ. Quan sát họ tìm món theo ngân sách, mua hàng và nhận hàng. Đo tỷ lệ đặt thành công, tỷ lệ mua lại, đơn hủy, thời gian giao, chi phí thu hút khách và lãi thực sau phí giao/thanh toán/khuyến mãi.

Thứ tự đề xuất: nguồn hàng và trang quản trị → dữ liệu thật/đơn hàng → thanh toán sandbox → AI API → kiểm tra bảo mật và vận hành → triển khai → thử nghiệm nhỏ có thanh toán thật → mở rộng.

Nhóm cần chuẩn bị: người phụ trách cửa hàng/giao hàng/hỗ trợ; bảng sản phẩm và giá/tồn; tài khoản cổng thanh toán được duyệt; tài khoản AI và hạn mức chi; tên miền/hosting/database; quy tắc đổi trả và đối soát. Các khoản phí, điều kiện thương mại và thủ tục cần xác nhận trực tiếp tại thời điểm đăng ký.
