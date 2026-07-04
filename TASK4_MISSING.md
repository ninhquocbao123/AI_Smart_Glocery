# Task 4 Missing Items

Sau khi đối chiếu yêu cầu của Task 4 với hiện trạng code trong `src/app/grocery-store/page.tsx`, dưới đây là những mục **chưa hoàn thành / còn thiếu**:

## 1. Thiếu nút "Proceed to Checkout" (Routing sang Screen 5)
- **Yêu cầu:** "Include a 'Proceed to Checkout' button that routes to Screen 5."
- **Hiện trạng:** Trong lần cập nhật code gần nhất để xây dựng lại giao diện, thanh Sticky Bar chứa nút Checkout ở dưới cùng màn hình đã vô tình bị xóa mất. Hiện tại trang Grocery Store không có nút nào để hoàn tất đơn hàng và chuyển hướng sang trang Profile (Screen 5).

## Các yêu cầu khác đã hoàn thành tốt:
- Đọc từ global cart state: **Xong**
- Nhóm các item theo Store (Bach Hoa Xanh, Winmart...): **Xong**
- Nút toggle "Consolidate Order" (gom đơn): **Xong**
- Thanh "Budget Progress Bar" đổi màu đỏ khi vượt ngân sách: **Xong**

**Hành động tiếp theo:** Cần bổ sung lại Sticky Bottom Bar chứa tổng tiền và nút **"Proceed to Checkout"** (sử dụng component `<Link href="/profile">`) vào cuối file `src/app/grocery-store/page.tsx`.
