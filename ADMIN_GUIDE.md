# Quản trị món ăn

Đăng nhập bằng **ninhquocbao69@gmail.com**, rồi vào `/admin` (hoặc chọn **Quản trị** trên thanh điều hướng / trang cá nhân). Tài khoản này đã được cấp quyền trong MongoDB hiện tại. Nếu chưa thấy nút, tải lại trang hoặc đăng xuất rồi đăng nhập.

## Thêm và sửa món

1. Chọn **Thêm món ăn**. Điền tên, mô tả, số người, thời gian và độ khó.
2. Tải ảnh thành phẩm JPG, PNG hoặc WebP tối đa 3 MB từ máy. Ảnh được kiểm tra, chuyển WebP và lưu trong collection `recipe_images` của MongoDB; không phụ thuộc ổ đĩa tạm của Vercel.
3. Thêm nguyên liệu. Đơn giá × số lượng mua quyết định chi phí. Định lượng nấu ghi riêng lượng thực tế cần dùng (ví dụ mua 1 gói 500 g nhưng dùng 200 g). Gia vị có sẵn không cộng vào giỏ.
4. Nhập từng bước: thao tác, thời gian, mức lửa và dấu hiệu đạt. Thêm hướng dẫn thành phẩm để phù hợp với ảnh.
5. **Lưu món ăn**, sau đó **Xem món** để kiểm tra trang chi tiết. Món mới xuất hiện trong danh mục và gợi ý theo ngân sách.

**Ẩn món** loại món khỏi danh mục và gợi ý nhưng giữ dữ liệu, lịch sử đơn hàng. **Hiện món** khôi phục hiển thị. Không xóa lịch sử mua hàng. Trang **Đơn hàng & cửa hàng** vẫn nằm tại `/admin/operations`.

## Quyền truy cập và triển khai

API kiểm tra quyền từ phiên đăng nhập và MongoDB cho từng thao tác. Người dùng thường không thể thêm món, tải ảnh hay cấp quyền qua hồ sơ/đăng ký.

Để cấp quyền cho một tài khoản đã đăng ký ở cơ sở dữ liệu khác, người vận hành chạy:

```powershell
node scripts/grant-admin.mjs email-da-dang-ky@example.com
```

Khi chuyển sang Vercel, cấu hình `MONGODB_URI` tới MongoDB có thể truy cập từ Internet (ví dụ Atlas), chuyển cả collections `users`, `recipes`, `recipe_images` và dữ liệu liên quan. Quyền admin trong MongoDB local không tự chuyển sang một database mới. Đặt `APP_URL` đúng domain HTTPS. Giữ khóa và kết nối trong biến môi trường phía máy chủ.

Giá và cửa hàng trong trình nhập món là dữ liệu tham khảo của nhóm, không chứng minh có kết nối đối tác hay tồn kho thực. Bộ seed bỏ qua món đã được admin chỉnh sửa để tránh ghi đè công thức.
