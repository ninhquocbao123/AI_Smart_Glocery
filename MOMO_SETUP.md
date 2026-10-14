# MoMo cho dự án EXE202

## 1. Đăng ký và lấy khóa test

Vào https://business.momo.vn, đăng ký tài khoản MoMo Business (M4B), chọn giải pháp thanh toán trực tuyến và thực hiện hồ sơ được MoMo yêu cầu. Điều kiện xét duyệt do MoMo quyết định; ví cá nhân không cung cấp bộ khóa merchant API. Nhóm sinh viên nên hỏi MoMo hồ sơ phù hợp trước khi dự định thu tiền thật.

Sau khi có quyền tích hợp test, lấy **Partner Code**, **Access Key**, **Secret Key** của môi trường test trong tài khoản M4B. Dùng hướng dẫn test chính thức để cài và sử dụng ứng dụng MoMo test; không dùng ví thật để thanh toán sandbox.

Nguồn: https://developers.momo.vn/v3/docs/payment/onboarding/integration-process/

## 2. Cấu hình dự án

Điền vào `.env.local` trên máy hoặc Environment Variables của Vercel. Không commit file chứa khóa, không gửi khóa vào chat và không đặt tiền tố `NEXT_PUBLIC_` cho khóa.

```dotenv
COMMERCE_MODE=demo
LIVE_PAYMENTS_ENABLED=false
MOMO_ENV=sandbox
MOMO_PARTNER_CODE=<partner code test của nhóm>
MOMO_ACCESS_KEY=<access key test của nhóm>
MOMO_SECRET_KEY=<secret key test của nhóm>
APP_URL=https://ten-mien-cua-nhom.vercel.app
```

`APP_URL` phải là URL gốc của deployment đang kiểm thử. MoMo không gọi IPN vào localhost; nếu chạy local, cần tunnel HTTPS riêng do nhóm cấu hình. Dùng cùng domain khi mở web để cookie đăng nhập hoạt động lúc quay về. Sau khi sửa biến môi trường: restart server local hoặc redeploy Vercel.

```bash
npm run momo:check
```

Lệnh chỉ kiểm tra cấu hình, không in khóa và không gọi API thanh toán.

## 3. Luồng đã nối trong code

Giỏ hàng → chọn **MoMo · thử nghiệm** → **Tiếp tục với MoMo** → backend tạo đơn và ký yêu cầu `captureWallet` → mở `payUrl` chính thức → người dùng xác nhận trong môi trường test → quay về Orders → backend đối soát trạng thái.

- IPN: `https://TEN-MIEN/api/payments/momo/webhook` (backend gửi tự động khi tạo phiên).
- Return: `https://TEN-MIEN/orders?paymentOrder=MA-DON` (backend tạo tự động).
- Chỉ webhook có chữ ký hợp lệ hoặc kết quả query từ server, đúng mã đơn và số tiền, mới xác nhận đã trả tiền. Query string do trình duyệt gửi không phải bằng chứng thanh toán.
- Nếu cổng lỗi, đơn vẫn được lưu trong Orders. Không tạo đơn thứ hai để thử lại; kiểm tra trạng thái của đơn cũ.

Nguồn API: https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/

## 4. Chuyển sang tiền thật

Hoàn thành tích hợp/test, xác minh M4B và yêu cầu khóa production. Tiếp tục UAT production và quy trình MoMo duyệt triển khai. Khóa test không sử dụng để thu tiền thật.

Khi được chấp thuận, thay bằng khóa production, đặt `MOMO_ENV=production`, `LIVE_PAYMENTS_ENABLED=true`, `COMMERCE_MODE=live`, dùng domain HTTPS và redeploy. Backend hiện yêu cầu cửa hàng nhận đơn, giá/tồn kho được cấu hình và MongoDB hỗ trợ transaction ở chế độ live; xem `PAYMENTS_SETUP.md`. Danh mục minh họa Bách Hóa Xanh/WinMart không có nghĩa các cửa hàng đó đã nhận đơn từ ứng dụng.

Hiện nhóm chưa có khóa nên chưa thể xác minh kết nối MoMo thực tế hoặc nhận tiền thật. Các kiểm thử tự động sử dụng phản hồi giả lập, không tạo giao dịch.
