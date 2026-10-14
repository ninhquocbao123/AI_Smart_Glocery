import type { Recipe } from '@/data/mockData';

export const websiteHelp = [
  { keywords: ['ngan sach', 'budget', 'chi tieu'], title: 'Ngân sách & chi tiêu', href: '/budget', answer: 'Ở Home, nhập ngân sách và số người để tìm món phù hợp. My Budget tổng hợp chi tiêu theo tháng, món đã mua và cửa hàng từ lịch sử đơn hàng; bạn có thể đặt mục tiêu chi tiêu trong trang cá nhân.' },
  { keywords: ['thanh toan', 'momo', 'payos', 'ngan hang', 'tra tien'], title: 'Thanh toán & đơn hàng', href: '/orders', answer: 'Chọn nguyên liệu vào giỏ, kiểm tra số lượng và địa chỉ rồi chọn phương thức thanh toán khả dụng. MoMo hoặc QR ngân hàng sẽ hướng dẫn bước tiếp theo. Kiểm tra trạng thái ở Orders; quay lại website không đồng nghĩa thanh toán thành công. Với đơn ghi Không thu tiền, giao dịch không thu tiền thật.' },
  { keywords: ['don hang', 'orders', 'giao hang', 'mua lai', 'huy don'], title: 'Theo dõi đơn hàng', href: '/orders', answer: 'Orders hiển thị lịch sử và trạng thái từng đơn. Chọn Mua lại để đưa nguyên liệu còn khả dụng vào giỏ, kiểm tra lại giá trước khi đặt. Trợ lý chỉ hướng dẫn, không tự hủy đơn hay xác nhận thanh toán.' },
  { keywords: ['khuyen mai', 'giam gia', 'deals', 'uu dai', 'sieu thi', 'cua hang'], title: 'Tìm ưu đãi', href: '/deals', answer: 'Vào Deals để tìm nguyên liệu và lọc theo cửa hàng. Giá trên danh mục là giá tham khảo do nhóm cập nhật; không phải thông tin giá hoặc tồn kho trực tiếp từ siêu thị. Kiểm tra tổng tiền trước khi đặt.' },
  { keywords: ['tai khoan', 'mat khau', 'ho so', 'ca nhan', 'dang nhap', 'admin', 'quan tri'], title: 'Tài khoản & hồ sơ', href: '/profile', answer: 'Trang cá nhân cho phép sửa tên, địa chỉ, số điện thoại, khẩu vị, dị ứng và mục tiêu chi tiêu. Nếu quên mật khẩu, mở Quên mật khẩu ở trang đăng nhập để xem hướng dẫn hỗ trợ. Tài khoản được cấp quyền quản trị có thể vào /admin để quản lý món. Không gửi mật khẩu hoặc mã OTP cho trợ lý.' },
  { keywords: ['smart cart', 'nguyen lieu', 'vao bep', 'cach nau', 'mon an', 'cong thuc', 'gio hang'], title: 'Khám phá món Việt', href: '/meal-plan', answer: 'Smart Cart là danh mục món Việt. Bấm vào món để xem ảnh, nguyên liệu, định lượng và các bước Cùng vào bếp. Đổi số người để điều chỉnh lượng nguyên liệu; đánh dấu món đã có rồi thêm phần còn thiếu vào giỏ.' },
];
export const normalizeQuestion = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
export function findRecipes(question: string, recipes: Recipe[]) {
  const q = normalizeQuestion(question);
  return recipes.map(recipe => {
    const title = normalizeQuestion(recipe.title);
    const score = q.includes(title) ? 100 : title.split(' ').filter(word => word.length > 2 && q.split(/\W+/).includes(word)).length;
    return { recipe, score };
  }).filter(x => x.score >= 2).sort((a, b) => b.score - a.score).slice(0, 4).map(x => x.recipe);
}
export function localAnswer(question: string, recipes: Recipe[]) {
  const matches = findRecipes(question, recipes);
  if (matches.length) {
    const recipe = matches[0];
    const guide = recipe.cookingGuide;
    const ingredients = guide?.measures.map(i => `${i.name}: ${i.quantity} ${i.unit}`) ?? recipe.ingredients.map(i => `${i.name}: ${i.quantity} ${i.unit}`);
    const steps = guide?.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.detail} Thời gian: ${s.duration}. Mức lửa: ${s.heat}. Dấu hiệu đạt: ${s.cue}`) ?? recipe.instructions.map((s, i) => `${i + 1}. ${s}`);
    return { answer: `${recipe.title} — ${recipe.servings} người, ${recipe.prepTime + recipe.cookTime} phút.\n${recipe.description}\n\nNguyên liệu:\n${ingredients.join('\n')}${guide?.pantry.length ? '\nGia vị có sẵn: ' + guide.pantry.map(i => `${i.name} ${i.quantity} ${i.unit}`).join(', ') : ''}\n\nCùng vào bếp:\n${steps.join('\n\n')}${guide?.finish ? '\n\nThành phẩm: ' + guide.finish : ''}`, links: matches.map(r => ({ title: r.title, href: '/meal-plan/' + r.id })) };
  }
  const q = normalizeQuestion(question);
  const topic = websiteHelp.find(t => t.keywords.some(k => q.includes(k)));
  if (topic) return { answer: topic.answer, links: [{ title: topic.title, href: topic.href }] };
  return { answer: 'Bạn có thể hỏi tên một món trong danh mục để xem nguyên liệu và cách nấu, hoặc hỏi về ngân sách, giỏ hàng, ưu đãi, thanh toán và tài khoản. Với câu hỏi này, tôi chưa có đủ thông tin để trả lời chính xác. Bạn mô tả rõ hơn món ăn hoặc thao tác đang gặp khó khăn nhé.', links: [{ title: 'Xem danh mục món Việt', href: '/meal-plan' }] };
}
