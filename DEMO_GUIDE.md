# Demo Smart Grocery — EXE202, FPTU

## Phạm vi bài môn học

Chạy trọn luồng đăng ký/đăng nhập → nhập ngân sách → gợi ý món → thêm giỏ → đặt đơn → thanh toán → lịch sử đơn và chi tiêu. Dữ liệu Bách Hóa Xanh, WinMart và Co.op Food là dữ liệu minh họa; không đặt hàng hoặc giao hàng thật từ siêu thị.

## Chạy local

1. npm install
2. Cấu hình .env.local theo .env.example. Không ghi đè MONGODB_URI đang có.
3. Đặt COMMERCE_MODE=demo và LIVE_PAYMENTS_ENABLED=false.
4. npm run db:prepare để tạo index chống trùng đơn.
5. npm run dev và mở http://localhost:3000.

MongoDB Atlas là lựa chọn thuận tiện khi đưa lên Vercel. Luồng demo không cần transaction giữ kho; không cần tài khoản admin hay cấu hình bảng giá thật.

## Kịch bản trình diễn 5 phút

1. Đăng ký tài khoản, đăng nhập vào Home.
2. Nhập 50.000–200.000 VNĐ, chọn số người và xem gợi ý ở trang riêng.
3. Chọn món, thêm nguyên liệu vào giỏ, mở Checkout.
4. Chọn cửa hàng, nhập số điện thoại và địa chỉ minh họa. Chọn “Thanh toán mô phỏng · Không thu tiền”.
5. Tạo đơn, tại Orders bấm “Mô phỏng thanh toán thành công”.
6. Bấm “Demo: bắt đầu giao hàng”, sau đó “Demo: hoàn thành đơn”.
7. Mở My Budget để xem đơn đã hoàn thành, tổng chi tiêu và cửa hàng. Thử Mua lại để tạo giỏ mới.
8. Có thể chọn COD: tạo đơn → bắt đầu giao → hoàn thành. Đơn chưa xử lý có thể hủy.

Thanh toán mô phỏng chỉ thay đổi dữ liệu demo trong database, không gọi cổng thanh toán và không chuyển tiền. Server chặn thao tác này với đơn live hoặc phiên MoMo sandbox. Các bước giao hàng của đơn demo đã được MoMo sandbox xác nhận vẫn có thể trình diễn.

## AI và thanh toán bên ngoài (tùy chọn)

- Gemini: cấu hình GEMINI_API_KEY và GEMINI_MODEL. Backend gọi API; nếu thiếu khóa, lỗi API hoặc hết hạn mức thì trả gợi ý theo thuật toán và hiển thị rõ nguồn.
- MoMo sandbox: giữ COMMERCE_MODE=demo, MOMO_ENV=sandbox; thêm MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY và APP_URL là URL HTTPS công khai. Chọn MoMo tại Checkout rồi mở thanh toán ở Orders. Không cần COMMERCE_MODE=live để thử sandbox.
- MoMo gửi kết quả tới APP_URL/api/payments/momo/webhook. Quay lại Orders rồi bấm Kiểm tra thanh toán nếu cần. Không thể bấm nút giả lập để đánh dấu đơn MoMo là đã trả tiền.
- payOS QR chuyển khoản thật cần tài khoản/kênh thanh toán hợp lệ. Không bật cho dữ liệu demo. Phần tích hợp đã có nhưng không cần kích hoạt để trình bày bài môn học.

Chưa có khóa của nhóm thì không thể xác nhận đã gọi Gemini hoặc thanh toán MoMo thật. Chỉ mô phỏng nội bộ hoạt động ngay với database.

## Tự deploy lên Vercel

1. Đẩy code lên GitHub, không đưa .env.local vào Git.
2. Import repository trên Vercel, chọn framework Next.js. Dùng build command npm run build -- --webpack nếu gặp lỗi Turbopack/font như trên Windows.
3. Cấu hình Environment Variables:
   - MONGODB_URI: database của nhóm.
   - COMMERCE_MODE=demo.
   - LIVE_PAYMENTS_ENABLED=false.
   - APP_URL=https://TEN-DU-AN.vercel.app.
   - Gemini/MoMo sandbox: chỉ thêm nếu có tài khoản và khóa.
4. Deploy. Khi biết domain chính xác, cập nhật APP_URL và redeploy nếu cần.
5. Đảm bảo database cho phép kết nối từ môi trường triển khai. Với MoMo sandbox, URL webhook phải truy cập công khai.
6. Chạy lại kịch bản 5 phút bằng tài khoản mới trên website đã deploy.

Không cần cấu hình cửa hàng thật, đối tác giao vận hoặc trang admin để chạy demo EXE202. BACKEND_SETUP.md mô tả phần nâng cao, chỉ dùng nếu nhóm muốn mở rộng sau này.

## Kiểm tra

npm test
npx tsc --noEmit
npm run lint -- --quiet
npm run build -- --webpack

node tests/integration.mjs kiểm tra API trên server đang chạy, chỉ dùng database demo; lệnh tạo tài khoản và đơn thử, không gọi cổng thanh toán thật.
