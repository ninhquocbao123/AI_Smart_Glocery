# Ảnh danh mục

50 ảnh WebP dùng cho 30 món ăn và 20 Deals, lưu trong `public/images/food`. MongoDB lưu đường dẫn `/images/food/<id>.webp`. Nguồn, tác giả và giấy phép nằm trong `credits.json` và `credits.html`.

Ảnh AI được tạo bằng công cụ image_gen tích hợp (không dùng API key của nhóm). Mẫu prompt: “One photorealistic catalog food photograph: [tên món và nguyên liệu cụ thể, hoặc sản phẩm]. Natural soft window light, neutral warm tabletop, centered subject filling frame, landscape 3:2. Authentic Vietnamese home food or fresh grocery product, no text, no logos, no graphics.” Mỗi món/sản phẩm có một yêu cầu riêng; loại bỏ nguyên liệu không thuộc công thức (ví dụ đậu hũ chay không có thịt, mì rau củ không có thịt).

Ảnh AI hiện dùng cho: recipe-002, recipe-006, recipe-013, recipe-017, recipe-021, deal-001, deal-007, deal-008, deal-009, deal-010, deal-011, deal-013, recipe-015, recipe-012, recipe-011, deal-019, deal-005, recipe-022, recipe-026, recipe-025, deal-020, recipe-023, recipe-030, deal-017, recipe-024, recipe-028, recipe-018, deal-018, deal-004, deal-015.

Ảnh chụp còn lại lấy từ Wikimedia Commons, có thông tin ghi công và giấy phép theo từng ảnh. Ảnh đã được thu nhỏ và chuyển WebP.

Chạy `npm run catalog:seed` để cập nhật đường dẫn MongoDB. Script không xóa tài khoản hoặc đơn hàng. Khi deploy phải đưa cả thư mục public/images lên repository.
