# Trợ lý Smart Grocery

Trợ lý nằm ở góc dưới website sau đăng nhập. Người dùng có thể nhập câu hỏi, hỏi tiếp trong cùng hội thoại, mở công thức liên quan và xóa hội thoại. Hội thoại chỉ giữ trong bộ nhớ trang và được xóa khi đổi tài khoản hoặc tải lại.

Backend `/api/assistant` xác thực phiên đăng nhập, giới hạn tần suất và độ dài câu hỏi. Trợ lý đọc danh mục đang hiển thị trong MongoDB và hướng dẫn các trang Home, My Budget, Smart Cart, Deals, Orders, hồ sơ. Không truy cập đơn hàng riêng hoặc thay đổi dữ liệu qua hội thoại.

## Bật trả lời bằng AI

Điền các biến đã có trong `.env.local` (trên Vercel dùng Environment Variables):

```dotenv
GEMINI_API_KEY=your_server_side_key
GEMINI_MODEL=your_available_model
```

Lấy khóa trong Google AI Studio, chọn model khả dụng cho tài khoản theo tài liệu chính thức https://ai.google.dev/api/generate-content. Không đặt khóa trong biến `NEXT_PUBLIC_*`, không đưa khóa vào Git hoặc chat. Khởi động lại ứng dụng sau khi thay đổi biến môi trường.

Tin nhắn và tối đa 8 tin gần nhất được gửi qua backend tới Gemini cùng ngữ cảnh công thức và hướng dẫn website. Hồ sơ cá nhân không được tự động gửi. Giao diện nhắc người dùng không nhập mật khẩu, OTP và thông tin thẻ.

Khi chưa có khóa hoặc dịch vụ gặp lỗi, trợ lý hiển thị rõ đang trả lời từ hướng dẫn có sẵn. Chế độ này tra cứu món theo tên và trả lời các chủ đề website; không phải mô hình AI sinh câu trả lời tự do.

## Nội dung giao diện

Đã bỏ từ “demo” khỏi các nhãn hiển thị. Giá vẫn ghi là tham khảo; đơn thử nghiệm vẫn ghi không thu tiền. Các giá trị nội bộ `demo` trong cơ sở dữ liệu, cổng thanh toán và thao tác thử nghiệm được giữ nguyên để bảo toàn trạng thái đơn, không đổi thành giao dịch thật bằng cách thay nhãn.
