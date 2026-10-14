# Cấu hình backend, AI, thanh toán và Vercel

> Phạm vi hiện tại là demo EXE202: hãy làm theo **DEMO_GUIDE.md**. Tài liệu dưới đây dành cho phần mở rộng vận hành thật. Demo hiện có nút thanh toán/giao hàng mô phỏng riêng, bị giới hạn ở server cho đơn demo; MoMo sandbox có thể chạy trên đơn demo khi có khóa. Các mô tả cũ về việc bỏ hoàn toàn demoPay hoặc chỉ cho đơn live gọi MoMo được thay thế bởi quy tắc này.

## Trạng thái thực tế

Code đã có luồng backend MoMo/payOS và Gemini. Chưa có khóa/tài khoản đối tác nên chưa chạy giao dịch thật hoặc gọi AI bằng tài khoản của nhóm. Mặc định COMMERCE_MODE=demo; không thu tiền. Không có API trực tiếp của Bách Hóa Xanh/WinMart: /stores dẫn tới website chính thức và ghi rõ bảng giá do nhóm quản lý. Không gửi đơn tự động tới siêu thị và không thu tiền thay siêu thị.

Nếu nhóm muốn thu tiền để đi chợ hộ, nhóm phải là đơn vị thực sự nhận đơn, cung ứng, giao hàng và chịu trách nhiệm hoàn tiền; cần đáp ứng điều kiện của cổng thanh toán. Không bật nhận đơn chỉ vì đã điền tên một chuỗi bán lẻ.

## Cấu hình môi trường

Dùng .env.example làm mẫu, giữ nguyên MONGODB_URI đang có trong .env.local. Không chép đè toàn bộ .env.local và không commit khóa.

| Biến | Mục đích |
|---|---|
| MONGODB_URI | MongoDB Atlas hoặc replica set có transaction; không dùng MongoDB standalone cho tạo/hủy đơn |
| APP_URL | URL gốc chính xác; local http://localhost:3000, production https://ten-du-an.vercel.app |
| COMMERCE_MODE | demo hoặc live. live chỉ báo giá từ Offer còn hiệu lực và cửa hàng đã bật nhận đơn |
| ADMIN_USER_IDS | Danh sách MongoDB User _id được cấp quyền, ngăn bằng dấu phẩy. Không dùng email tự đăng ký để cấp admin |
| GEMINI_API_KEY / GEMINI_MODEL | Khóa và model được phép dùng trong Google AI Studio; backend gọi generateContent |
| MOMO_ENV | sandbox hoặc production; mặc định sandbox |
| MOMO_PARTNER_CODE / MOMO_ACCESS_KEY / MOMO_SECRET_KEY | Lấy trong tài khoản MoMo đối tác; tài khoản ví cá nhân không tự cung cấp các khóa này |
| PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY | Lấy từ kênh thanh toán payOS sau xác minh |
| LIVE_PAYMENTS_ENABLED | Mặc định false. true mới cho MoMo production và payOS tạo link; đây không thay thế việc duyệt merchant |

Các khóa trên không có tiền tố NEXT_PUBLIC_. Dùng database và bộ khóa khác nhau cho thử nghiệm/production. Không đổi MOMO_ENV để thanh toán tiếp đơn của môi trường cũ.

## Khởi động và quản trị

1. npm install
2. Cấu hình MongoDB, APP_URL và các biến cần thiết.
3. npm run db:prepare để tạo unique indexes cho mã đơn/yêu cầu thanh toán, danh mục và TTL cho giới hạn API. Lệnh không xóa dữ liệu. Nếu index báo trùng, kiểm tra dữ liệu thay vì xóa lịch sử.
4. npm run dev. Sau thay đổi schema hoặc biến môi trường, dừng và khởi động lại dev server.
5. Đăng ký tài khoản của nhóm. Lấy _id của tài khoản từ database, thêm vào ADMIN_USER_IDS và khởi động lại.
6. Mở /admin để cập nhật cửa hàng, người bán thực sự, khu vực giao, giá và tồn còn bán. Mặc định không có cửa hàng live nào nhận đơn.

Mã nguyên liệu và đơn vị phải khớp công thức (ví dụ i-001-1, gram); price là VNĐ trên mỗi đơn vị. Không lấy giá một gói để nhập cho một gram. Một SKU được ánh xạ vào một mã nguyên liệu trong một cửa hàng; nếu công thức dùng mã khác, cần thống nhất mã trước khi bán. stock là tồn chưa giữ cho các đơn đang chờ. Không đưa hàng đang giữ vào stock khi cập nhật lại. Bảng giá hết hiệu lực thì checkout bị chặn; /admin đặt hiệu lực 24 giờ, API cho tối đa 7 ngày.

## Luồng thanh toán

Checkout gọi /api/checkout/quote, hiển thị giá server rồi tạo đơn bằng /api/orders. Server tính lại giá, kiểm tra expectedTotal, gộp nguyên liệu trùng, giữ tồn trong transaction và lưu snapshot. clientRequestId giúp gửi lại cùng yêu cầu không tạo thêm đơn.

Sau tạo đơn, khách mở Orders, bấm Thanh toán để backend gọi nhà cung cấp và chuyển sang trang thanh toán chính thức. Chỉ đơn live mới được gọi API thanh toán. Đơn demo không được đổi thành đã trả tiền bằng nút demoPay; endpoint đó đã bị bỏ.

- MoMo IPN: https://TEN-MIEN/api/payments/momo/webhook
- payOS webhook: https://TEN-MIEN/api/payments/payos/webhook
- Return/cancel URL: https://TEN-MIEN/orders

Đăng ký webhook payOS trong dashboard của kênh thanh toán; MoMo nhận ipnUrl trong yêu cầu tạo. Endpoint webhook phải truy cập được từ Internet, không bị Vercel Deployment Protection chặn. Dùng URL production ổn định hoặc môi trường test công khai đã cấu hình, không dùng localhost làm webhook ngoài Internet.

MoMo kiểm tra HMAC, partnerCode, requestId, amount, orderId; payOS dùng SDK chính thức kiểm tra chữ ký. Chỉ cập nhật paid sau xác minh, với cập nhật MongoDB nguyên tử tránh ghi nhận hai lần. Redirect không xác nhận thanh toán. Nút Kiểm tra thanh toán gọi truy vấn server-to-server khi khách chưa thấy webhook cập nhật.

Mỗi đơn chỉ có một yêu cầu tạo phiên. Nếu mạng timeout sau khi đã gửi, backend không tạo mã giao dịch mới hoặc giải phóng tồn mù quáng; dùng kiểm tra thanh toán và đối soát trong dashboard nhà cung cấp. Phiên chưa rõ kết quả cần xử lý hỗ trợ. Hủy đơn tự động chỉ hỗ trợ trước khi bắt đầu phiên thanh toán. Hủy/hoàn sau thanh toán, thanh toán một phần/thừa, phiên timeout và giải phóng tồn sau đối soát hiện cần người vận hành; chưa có API hoàn tiền tự động hay cron tự hết hạn giữ hàng.

Thanh toán thành công chuyển đơn sang Chờ chuẩn bị. Admin xác nhận đang giao/đã giao; khách xác nhận nhận hàng. COD chỉ ghi nhận thu tiền khi admin xác nhận sau giao. Budget dùng tháng đặt hàng: đơn live đã trả tiền và lịch sử demo đã giao được ghi nhận; MoMo sandbox không tính là chi tiêu thật. Chưa có sổ hoàn tiền tự động.

## AI

POST /api/recommendations nhận budget, servings, store. Backend đọc chế độ ăn/nguyên liệu tránh từ tài khoản, lọc món đủ điều kiện rồi gửi danh sách ứng viên cho Gemini xếp hạng. Không gửi email, điện thoại, địa chỉ. Kết quả phải là mã món hợp lệ, không trùng; giá được tính lại tại backend. Thiếu key hoặc AI lỗi thì trả source=rules và giải thích rõ.

Giới hạn hiện tại: 12 yêu cầu gợi ý/phút/tài khoản; tối đa 30 lần gọi AI/ngày/tài khoản và 1000/ngày toàn ứng dụng, lưu MongoDB. Cấu hình thêm hạn mức chi phí ở Google. Ở demo dùng giá tham khảo; live cần đầy đủ Offer còn hiệu lực và tồn kho cho từng nguyên liệu. Dữ liệu dinh dưỡng/dị ứng chỉ dựa công thức, cần kiểm tra thành phần thực tế.

## API chính

| Endpoint | Quyền / chức năng |
|---|---|
| GET /api/stores | Danh bạ, trạng thái nhận đơn và cổng đã cấu hình; không trả khóa |
| GET /api/products?store=Winmart | Giá còn hiệu lực từ database nhóm, chưa phải API siêu thị |
| GET /api/deals | Ưu đãi mẫu ở demo; giá giảm thật do admin nhập ở live |
| POST /api/checkout/quote | Khách đăng nhập, báo giá phía server |
| GET/POST/PATCH /api/orders | Lịch sử, tạo, hủy trước thanh toán, nhận hàng; chỉ đơn của tài khoản |
| POST /api/payments | {orderId, action:"create" hoặc "check"} |
| POST /api/recommendations | {budget, servings, store} |
| GET/PUT /api/admin/catalog | Chỉ admin, cửa hàng và sản phẩm |
| GET/PATCH /api/admin/orders | Chỉ admin, giao hàng hoặc action=confirmCod |
| POST /api/recipes/seed | Đã khóa quyền admin; không công khai thao tác ghi DB |

Ví dụ PUT /api/admin/catalog cho offer (thay ngày hiệu lực bằng ngày trong 7 ngày tới):

```json
{"store":"Winmart","ingredientId":"i-001-1","sku":"SKU-THUC-TE","name":"Nạm bò","unit":"gram","category":"Đạm","price":220,"stock":5000,"originalPrice":250,"validUntil":"YYYY-MM-DDTHH:mm:ss+07:00"}
```

Giá ở ví dụ chỉ minh họa định dạng, không phải báo giá siêu thị. API admin dùng cookie của tài khoản admin, không có khóa quản trị dùng chung đưa ra trình duyệt.

## Bạn tự triển khai Vercel

1. Đưa code lên repository của nhóm, kiểm tra .env.local không nằm trong Git.
2. Import project vào Vercel, chọn framework Next.js. Không dùng static export vì có API và cookie server.
3. Điền Environment Variables từ bảng trên. Preview giữ demo và database riêng; không cấp khóa live cho preview.
4. Deploy, đặt APP_URL theo domain thật rồi redeploy. Khởi đầu giữ LIVE_PAYMENTS_ENABLED=false.
5. Cho phép kết nối MongoDB từ hạ tầng triển khai theo cấu hình mạng của tài khoản; chạy db:prepare cho database đích. Dùng tài khoản database quyền tối thiểu cần thiết.
6. Bật AI bằng key/model của nhóm. Thiết lập MoMo test để kiểm tra callback. payOS chỉ thử bằng kênh/môi trường được nhà cung cấp hướng dẫn; code hiện dùng endpoint merchant chính thức, không tự giả định đó là sandbox.
7. Đăng ký webhook HTTPS, kiểm tra log và các trường hợp thành công, callback lặp/sai chữ ký, sai tiền, timeout, hai khách mua hàng cuối cùng, hủy và đối soát.
8. Chỉ bật live khi nguồn hàng/người bán, tài khoản merchant và quy trình hỗ trợ/hoàn tiền đã sẵn sàng. Cấu hình rate limiting/WAF của nền tảng phù hợp lưu lượng; không dựa riêng IP header trên máy chủ tự dựng.

Kiểm tra local: npm test; npx tsc --noEmit; npm run lint -- --quiet; npm run build. Nếu Turbopack trên Windows lỗi xử lý font như trước, có thể kiểm tra bằng npm run build -- --webpack. tests/integration.mjs tạo tài khoản/đơn thử và chỉ chạy khi chế độ demo; dùng database test, không trỏ production.

Giới hạn trước mở rộng: chưa có API đối tác siêu thị, đồng bộ tồn kho tự động, giao vận đối tác, hoàn tiền tự động, email xác minh/khôi phục mật khẩu và đối soát nền theo lịch. Những phần này cần triển khai/kiểm thử tiếp theo mô hình vận hành thực tế. Gợi ý AI, cấu trúc webhook và unit tests không thay thế kiểm thử sandbox có credential thật.

## Tài liệu chính thức

- MoMo: https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/
- MoMo IPN: https://developers.momo.vn/v3/docs/payment/api/result-handling/notification/
- MoMo query: https://developers.momo.vn/v3/docs/payment/api/payment-api/query/
- payOS SDK: https://payos.vn/docs/sdks/back-end/node/
- payOS webhook: https://payos.vn/docs/du-lieu-tra-ve/webhook/
- Gemini: https://ai.google.dev/api/generate-content
- Vercel Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
