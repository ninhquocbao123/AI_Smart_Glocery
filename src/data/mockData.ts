// ─────────────────────────────────────────────────────────────
// SmartCart AI — Dữ liệu mẫu (Mock Data)
// 10 công thức món ăn Việt Nam với giá cả, thời gian nấu và nguyên liệu khác nhau.
// Mỗi nguyên liệu gồm tên, đơn giá (VND) và siêu thị.
// ─────────────────────────────────────────────────────────────

export type Store = "Bach Hoa Xanh" | "Winmart" | "Coop Food";

export interface Ingredient {
  id: string;
  name: string;
  price: number;       // VND mỗi đơn vị
  unit: string;        // ví dụ: "gram", "quả", "gói", "chai"
  quantity: number;    // số lượng công thức cần
  store: Store;
  category: string;    // ví dụ: "Đạm", "Rau củ", "Gia vị"
  image: string;       // URL hình ảnh nguyên liệu thực tế
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;       // đường dẫn hình ảnh mẫu
  prepTime: number;    // phút chuẩn bị
  cookTime: number;    // phút nấu
  servings: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  cuisine: string;
  tags: string[];
  totalPrice: number;  // VND — tổng tiền nguyên liệu
  ingredients: Ingredient[];
  instructions: string[];
}

// ── Công thức món ăn ──────────────────────────────────────────

export const recipes: Recipe[] = [
  {
    id: "recipe-001",
    title: "Phở Bò",
    description:
      "Món phở bò truyền thống thơm lừng, nước dùng ngọt thanh được ninh từ xương bò cùng hoa hồi, quế và gừng nướng chín.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=800&auto=format&fit=crop",
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: "Khó",
    cuisine: "Việt Nam",
    tags: ["súp", "thịt bò", "truyền thống", "bữa tối"],
    totalPrice: 185000,
    ingredients: [
      { id: "i-001-1", name: "Nạm bò", price: 220, unit: "gram", quantity: 500, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-2", name: "Xương bò", price: 80, unit: "gram", quantity: 300, store: "Bach Hoa Xanh", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-3", name: "Bánh phở", price: 25000, unit: "gói", quantity: 1, store: "Coop Food", category: "Tinh bột", image: "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-4", name: "Hoa hồi", price: 5000, unit: "bông", quantity: 3, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-5", name: "Thanh quế", price: 4000, unit: "thanh", quantity: 2, store: "Winmart", category: "Gia vị", image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-6", name: "Hành tây", price: 5000, unit: "củ", quantity: 2, store: "Coop Food", category: "Rau củ", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-7", name: "Gừng", price: 3000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-8", name: "Giá đỗ", price: 8000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-9", name: "Rau húng quế", price: 3000, unit: "bó", quantity: 1, store: "Coop Food", category: "Rau thơm", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=400&auto=format&fit=crop" },
      { id: "i-001-10", name: "Nước mắm", price: 18000, unit: "chai", quantity: 1, store: "Winmart", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Nướng hành tây và gừng trên lửa cho đến khi xém đen và dậy mùi thơm.",
      "Ninh xương bò cùng hoa hồi, hành tây, gừng và thanh quế trong nước khoảng 3 giờ.",
      "Lọc lấy nước dùng trong, nêm nếm gia vị với nước mắm và chút muối cho vừa ăn.",
      "Chần bánh phở qua nước sôi rồi xếp vào bát tô.",
      "Thái mỏng nạm bò chín rồi xếp đều lên trên bánh phở.",
      "Chan nước dùng phở thật nóng hổi vào bát, dùng kèm giá đỗ và rau húng quế tươi."
    ],
  },
  {
    id: "recipe-002",
    title: "Cơm Tấm Sườn Bì Chả",
    description:
      "Cơm tấm dùng kèm sườn heo nướng sả mật ong mềm mọng, bì trộn thính thơm lừng và chả trứng hấp - đặc sản Sài Gòn.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
    prepTime: 20,
    cookTime: 40,
    servings: 2,
    difficulty: "Trung bình",
    cuisine: "Việt Nam",
    tags: ["cơm tấm", "thịt heo", "bữa trưa", "đường phố"],
    totalPrice: 95000,
    ingredients: [
      { id: "i-002-1", name: "Gạo tấm", price: 22000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Tinh bột", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-2", name: "Sườn heo", price: 160, unit: "gram", quantity: 300, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1432139786573-61502164e341?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-3", name: "Bì heo", price: 120, unit: "gram", quantity: 150, store: "Coop Food", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-4", name: "Trứng gà", price: 4000, unit: "quả", quantity: 3, store: "Bach Hoa Xanh", category: "Đạm", image: "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-5", name: "Sả", price: 2000, unit: "nhánh", quantity: 3, store: "Coop Food", category: "Rau thơm", image: "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-6", name: "Tỏi", price: 3000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1540120084845-77983c260381?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-7", name: "Mỡ hành", price: 12000, unit: "chai", quantity: 1, store: "Winmart", category: "Nước sốt", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop" },
      { id: "i-002-8", name: "Đồ chua", price: 10000, unit: "gói", quantity: 1, store: "Coop Food", category: "Rau củ", image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Ướp sườn cốt lết với sả, tỏi băm, mật ong và nước mắm trong 30 phút.",
      "Nướng sườn trên bếp than hoa cho đến khi chín mềm và vàng đều hai mặt.",
      "Luộc bì heo chín, thái sợi mỏng rồi trộn đều với thính gạo rang thơm.",
      "Trộn trứng với thịt băm băm nhỏ, nấm mèo và bún tàu rồi mang hấp 20 phút để làm chả trứng.",
      "Nấu cơm tấm chín dẻo, bày ra đĩa cùng sườn nướng, bì và chả chưng.",
      "Rưới mỡ hành lên mặt cơm, dùng kèm đồ chua và nước mắm chua ngọt đặc trưng."
    ],
  },
  {
    id: "recipe-003",
    title: "Bún Chả Hà Nội",
    description:
      "Thịt viên nướng cháy cạnh và thịt ba chỉ nướng thơm phức ăn kèm bún tươi, rau thơm và nước chấm chua ngọt.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
    prepTime: 25,
    cookTime: 30,
    servings: 3,
    difficulty: "Trung bình",
    cuisine: "Việt Nam",
    tags: ["bún", "thịt heo", "nướng", "hà nội"],
    totalPrice: 120000,
    ingredients: [
      { id: "i-003-1", name: "Thịt lợn xay", price: 140, unit: "gram", quantity: 400, store: "Bach Hoa Xanh", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-2", name: "Thịt ba chỉ", price: 180, unit: "gram", quantity: 200, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-3", name: "Bún tươi", price: 15000, unit: "gói", quantity: 1, store: "Coop Food", category: "Tinh bột", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-4", name: "Nước mắm", price: 18000, unit: "chai", quantity: 1, store: "Bach Hoa Xanh", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-5", name: "Đường", price: 12000, unit: "gói", quantity: 1, store: "Coop Food", category: "Gia vị", image: "https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-6", name: "Chanh", price: 2000, unit: "quả", quantity: 3, store: "Bach Hoa Xanh", category: "Trái cây", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-7", name: "Rau xà lách", price: 8000, unit: "cây", quantity: 1, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-8", name: "Rau thơm các loại", price: 5000, unit: "bó", quantity: 2, store: "Coop Food", category: "Rau thơm", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop" },
      { id: "i-003-9", name: "Tỏi", price: 3000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1540120084845-77983c260381?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Trộn thịt băm xay với tỏi băm, nước mắm, đường và tiêu; vo viên tròn rồi nặn dẹt.",
      "Thái mỏng thịt ba chỉ thành miếng vừa ăn, ướp gia vị tương tự.",
      "Nướng thịt viên và thịt miếng trên vỉ nướng bếp than hoa cho thơm vàng chín khói.",
      "Pha nước mắm chấm chua ngọt từ nước cốt chanh, nước mắm, đường và nước ấm.",
      "Chần qua bún tươi rồi bày ra đĩa.",
      "Ăn bún kèm thịt nướng trong bát nước mắm chấm chua ngọt ấm nóng và rau thơm các loại."
    ],
  },
  {
    id: "recipe-004",
    title: "Gỏi Cuốn Tôm Thịt",
    description:
      "Bánh tráng cuộn tròn tôm thẻ luộc, thịt thăn heo chín, bún tươi và rau húng thơm ngậy, dùng với nước chấm tương đen.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    prepTime: 30,
    cookTime: 10,
    servings: 4,
    difficulty: "Dễ",
    cuisine: "Việt Nam",
    tags: ["khai vị", "sức khỏe", "tôm", "thanh mát"],
    totalPrice: 78000,
    ingredients: [
      { id: "i-004-1", name: "Bánh tráng", price: 18000, unit: "gói", quantity: 1, store: "Coop Food", category: "Tinh bột", image: "https://images.unsplash.com/photo-1558985250-27a406d64cb3?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-2", name: "Tôm tươi", price: 250, unit: "gram", quantity: 200, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-3", name: "Thịt thăn heo", price: 150, unit: "gram", quantity: 150, store: "Bach Hoa Xanh", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-4", name: "Bún tươi", price: 15000, unit: "gói", quantity: 1, store: "Coop Food", category: "Tinh bột", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-5", name: "Rau xà lách", price: 8000, unit: "cây", quantity: 1, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-6", name: "Rau húng lủi", price: 3000, unit: "bó", quantity: 1, store: "Bach Hoa Xanh", category: "Rau thơm", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-7", name: "Tương đen", price: 15000, unit: "chai", quantity: 1, store: "Coop Food", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-004-8", name: "Đậu phộng", price: 12000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Ăn vặt", image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Luộc chín tôm và thịt thăn với chút muối; bóc vỏ tôm cắt đôi dọc lưng, thái mỏng thịt.",
      "Chần bún tươi qua nước sôi rồi để ráo.",
      "Thấm nước làm ẩm mềm bánh tráng.",
      "Xếp lần lượt xà lách, rau thơm, bún, tôm luộc và thịt thăn vào lòng bánh tráng.",
      "Cuộn tròn chặt tay, gập hai bên mép bánh tráng lại.",
      "Giã nhỏ đậu phộng rang rồi rắc lên nước chấm tương đen xào tỏi thơm để chấm ăn kèm."
    ],
  },
  {
    id: "recipe-005",
    title: "Bánh Mì Thịt Nướng",
    description:
      "Bánh mì vỏ giòn kẹp thịt nướng sả đậm đà hương vị truyền thống, ăn kèm đồ chua, dưa leo và rau mùi.",
    image: "https://images.unsplash.com/photo-1609167921936-6aa64b9c48fc?q=80&w=800&auto=format&fit=crop",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "Dễ",
    cuisine: "Việt Nam",
    tags: ["bánh mì", "đường phố", "thịt heo", "nhanh gọn"],
    totalPrice: 55000,
    ingredients: [
      { id: "i-005-1", name: "Bánh mì ổ", price: 5000, unit: "cái", quantity: 2, store: "Bach Hoa Xanh", category: "Tinh bột", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-2", name: "Nạc vai heo", price: 150, unit: "gram", quantity: 250, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-3", name: "Sả", price: 2000, unit: "nhánh", quantity: 2, store: "Coop Food", category: "Rau thơm", image: "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-4", name: "Củ cải trắng", price: 6000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-5", name: "Củ cà rốt", price: 4000, unit: "củ", quantity: 1, store: "Coop Food", category: "Rau củ", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-6", name: "Dưa leo", price: 3000, unit: "quả", quantity: 1, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1449339044510-72120b572355?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-7", name: "Ớt tươi", price: 2000, unit: "quả", quantity: 3, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1588252393774-c116b9dc9c1c?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-8", name: "Rau ngò rí", price: 3000, unit: "bó", quantity: 1, store: "Coop Food", category: "Rau thơm", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=400&auto=format&fit=crop" },
      { id: "i-005-9", name: "Sốt mayonnaise", price: 15000, unit: "chai", quantity: 1, store: "Winmart", category: "Nước sốt", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Thái mỏng nạc vai heo, ướp sả băm, tỏi băm, dầu hào, đường và nước mắm.",
      "Nướng thịt trên bếp hoặc áp chảo cho đến khi chín vàng ruộm thơm mùi caramel.",
      "Làm củ cải và cà rốt bào sợi ngâm chua với giấm và đường.",
      "Cắt bánh mì dọc một bên rồi nướng sơ cho vỏ bánh nóng giòn.",
      "Phết sốt mayonnaise vào bên trong, thêm thịt nướng, dưa leo xắt mỏng, đồ chua và rau ngò.",
      "Thêm ớt cắt lát tùy vị cay và dùng nóng hổi."
    ],
  },
  {
    id: "recipe-006",
    title: "Thịt Kho Tàu",
    description:
      "Thịt ba chỉ béo ngậy kho mềm nhừ cùng trứng vịt chín ngấm trong nước dừa tươi ngọt thanh màu cánh gián đậm đà.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    prepTime: 15,
    cookTime: 45,
    servings: 3,
    difficulty: "Trung bình",
    cuisine: "Việt Nam",
    tags: ["thịt heo", "kho dừa", "truyền thống", "bữa tối"],
    totalPrice: 98000,
    ingredients: [
      { id: "i-006-1", name: "Thịt ba chỉ", price: 180, unit: "gram", quantity: 400, store: "Coop Food", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-2", name: "Nước dừa tươi", price: 10000, unit: "trái", quantity: 1, store: "Winmart", category: "Đồ uống", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-3", name: "Đường", price: 12000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-4", name: "Nước mắm", price: 18000, unit: "chai", quantity: 1, store: "Coop Food", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-5", name: "Hành tím", price: 5000, unit: "túi", quantity: 1, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-6", name: "Tiêu đen", price: 8000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1508807526345-15e988543ad4?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-7", name: "Tỏi", price: 3000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1540120084845-77983c260381?q=80&w=400&auto=format&fit=crop" },
      { id: "i-006-8", name: "Ớt tươi", price: 2000, unit: "quả", quantity: 2, store: "Coop Food", category: "Gia vị", image: "https://images.unsplash.com/photo-1588252393774-c116b9dc9c1c?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Thái thịt ba chỉ thành những khối vuông dày đều nhau rồi ướp với hành, tỏi băm và hạt nêm.",
      "Thắng đường cát trong nồi cho đến khi chuyển thành màu vàng nâu cánh gián.",
      "Cho thịt vào nồi đảo thật săn để ngấm màu nước màu caramel.",
      "Đổ nước dừa tươi vào ngập mặt thịt và đun sôi rồi vặn lửa liu riu vớt bọt.",
      "Bóc vỏ trứng vịt đã luộc chín, cho vào nồi kho chung với thịt cho ngấm gia vị.",
      "Simmer tiếp khoảng 30 phút nữa đến khi thịt mềm nhừ, rắc tiêu đen lên trên rồi tắt bếp."
    ],
  },
  {
    id: "recipe-007",
    title: "Bò Lúc Lắc",
    description:
      "Thịt bò thăn mềm áp chảo lửa lớn xém cạnh với tỏi băm và bơ, dùng kèm rau xà lách xoong chua ngọt kiểu Pháp-Việt.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop",
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: "Dễ",
    cuisine: "Việt Nam",
    tags: ["thịt bò", "nhanh gọn", "cao cấp", "bữa tối"],
    totalPrice: 165000,
    ingredients: [
      { id: "i-007-1", name: "Thịt thăn bò", price: 350, unit: "gram", quantity: 300, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-2", name: "Tỏi", price: 3000, unit: "củ", quantity: 2, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1540120084845-77983c260381?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-3", name: "Bơ lạt", price: 25000, unit: "gói", quantity: 1, store: "Coop Food", category: "Bơ sữa", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-4", name: "Nước tương", price: 15000, unit: "chai", quantity: 1, store: "Winmart", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-5", name: "Dầu hào", price: 18000, unit: "chai", quantity: 1, store: "Coop Food", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-6", name: "Xà lách xoong", price: 8000, unit: "bó", quantity: 1, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-7", name: "Cà chua", price: 5000, unit: "quả", quantity: 2, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-8", name: "Hành tây", price: 5000, unit: "củ", quantity: 1, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
      { id: "i-007-9", name: "Chanh", price: 2000, unit: "quả", quantity: 2, store: "Coop Food", category: "Trái cây", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Thái thịt thăn bò thành các khối vuông nhỏ khoảng 2cm, ướp nước tương, dầu hào và tỏi băm.",
      "Đun nóng chảo dầu trên lửa cực lớn cho đến khi bốc khói.",
      "Trút thịt bò vào áp chảo nhanh tay xém các cạnh trong 1-2 phút.",
      "Cho thêm bơ lạt, hành tây cắt múi và xóc chảo liên tục cho bò chín mềm mọng.",
      "Xếp xà lách xoong và cà chua thái lát ra đĩa.",
      "Trút bò lúc lắc nóng hổi lên đĩa rau và chấm ăn kèm muối tiêu chanh."
    ],
  },
  {
    id: "recipe-008",
    title: "Canh Chua Cá Lóc",
    description:
      "Canh chua cá lóc miền Tây chua chua ngọt ngọt thanh mát từ me quả, dứa, cà chua, giá đỗ và rau thơm ngò ôm ngon lành.",
    image: "https://images.unsplash.com/photo-1547928576-a4a33237cb35?q=80&w=800&auto=format&fit=crop",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "Dễ",
    cuisine: "Việt Nam",
    tags: ["súp", "cá", "canh chua", "sức khỏe"],
    totalPrice: 72000,
    ingredients: [
      { id: "i-008-1", name: "Cá lóc", price: 200, unit: "gram", quantity: 300, store: "Bach Hoa Xanh", category: "Đạm", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-2", name: "Me chua", price: 10000, unit: "gói", quantity: 1, store: "Coop Food", category: "Nước sốt", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-3", name: "Thơm (Dứa)", price: 15000, unit: "quả", quantity: 1, store: "Winmart", category: "Trái cây", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-4", name: "Cà chua", price: 5000, unit: "quả", quantity: 2, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-5", name: "Đậu bắp", price: 6000, unit: "gói", quantity: 1, store: "Coop Food", category: "Rau củ", image: "https://images.unsplash.com/photo-1449339044510-72120b572355?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-6", name: "Giá đỗ", price: 8000, unit: "gói", quantity: 1, store: "Winmart", category: "Rau củ", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-7", name: "Rau om (Ngò ôm)", price: 3000, unit: "bó", quantity: 1, store: "Bach Hoa Xanh", category: "Rau thơm", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop" },
      { id: "i-008-8", name: "Nước mắm", price: 18000, unit: "chai", quantity: 1, store: "Coop Food", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Hòa me quả vào bát nước sôi lọc bã để lấy nước cốt chua me.",
      "Đun sôi nước dùng canh, cho nước cốt chua me cùng dứa thái miếng vào nồi trước.",
      "Cho thêm cà chua bổ múi và đậu bắp vào đun liu riu khoảng 10 phút.",
      "Nhẹ nhàng cho cá lóc cắt khúc vào đun sôi tiếp trong 5 phút đến khi chín ngon.",
      "Nêm nước mắm và một chút đường cát sao cho đạt vị chua ngọt vừa ăn.",
      "Múc canh ra tô lớn, cho thêm giá đỗ xanh và rau om cắt khúc thơm lừng lên trên."
    ],
  },
  {
    id: "recipe-009",
    title: "Xôi Gà Xé",
    description:
      "Nếp dẻo thơm đồ nóng hổi xếp thịt đùi gà luộc xé sợi mềm ngọt dai, rắc hành phi giòn và rưới dầu hành lá béo thơm ngon.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
    prepTime: 20,
    cookTime: 50,
    servings: 3,
    difficulty: "Trung bình",
    cuisine: "Việt Nam",
    tags: ["bữa sáng", "thịt gà", "xôi", "ấm bụng"],
    totalPrice: 88000,
    ingredients: [
      { id: "i-009-1", name: "Gạo nếp", price: 20000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Tinh bột", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-2", name: "Chicken thigh", price: 120, unit: "gram", quantity: 400, store: "Winmart", category: "Đạm", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-3", name: "Hành tím", price: 5000, unit: "túi", quantity: 2, store: "Coop Food", category: "Rau củ", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-4", name: "Hành lá", price: 3000, unit: "bó", quantity: 2, store: "Bach Hoa Xanh", category: "Rau thơm", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-5", name: "Dầu ăn", price: 30000, unit: "chai", quantity: 1, store: "Winmart", category: "Dầu ăn", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-6", name: "Gừng", price: 3000, unit: "củ", quantity: 1, store: "Coop Food", category: "Gia vị", image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400&auto=format&fit=crop" },
      { id: "i-009-7", name: "Muối", price: 5000, unit: "gói", quantity: 1, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Ngâm gạo nếp dẻo trước khoảng 4 giờ rồi đem đồ hơi nước cho xôi chín căng bóng.",
      "Luộc đùi gà chín cùng lát gừng tươi đập dập và muối biển cho đậm đà.",
      "Vớt thịt đùi gà luộc chín ráo nước, xé thành sợi vừa ăn rồi trộn chút gia vị.",
      "Thái lát hành tím băm phi vàng thơm giòn trên chảo dầu nóng.",
      "Làm dầu hành lá: Cắt nhỏ hành lá rưới dầu ăn đun cực nóng lên cho chín tới.",
      "Xới xôi nếp ra đĩa, đặt gà xé sợi lên mặt xôi, rắc hành phi và rưới mỡ hành thơm phức lên trên."
    ],
  },
  {
    id: "recipe-010",
    title: "Rau Muống Xào Tỏi",
    description:
      "Rau muống xanh mướt giòn rụm sần sật xào nhanh trên lửa lớn cùng tỏi băm thơm lừng lôi cuốn.",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=800&auto=format&fit=crop",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Dễ",
    cuisine: "Việt Nam",
    tags: ["rau xanh", "nhanh gọn", "gia đình", "bữa trưa"],
    totalPrice: 45000,
    ingredients: [
      { id: "i-010-1", name: "Rau muống", price: 10000, unit: "bó", quantity: 1, store: "Bach Hoa Xanh", category: "Rau củ", image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-2", name: "Tỏi", price: 3000, unit: "củ", quantity: 2, store: "Bach Hoa Xanh", category: "Gia vị", image: "https://images.unsplash.com/photo-1540120084845-77983c260381?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-3", name: "Dầu ăn", price: 30000, unit: "chai", quantity: 1, store: "Winmart", category: "Dầu ăn", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-4", name: "Nước mắm", price: 18000, unit: "chai", quantity: 1, store: "Winmart", category: "Nước sốt", image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-5", name: "Đường", price: 12000, unit: "gói", quantity: 1, store: "Coop Food", category: "Gia vị", image: "https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-6", name: "Muối", price: 5000, unit: "gói", quantity: 1, store: "Winmart", category: "Gia vị", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=400&auto=format&fit=crop" },
      { id: "i-010-7", name: "Ớt tươi", price: 2000, unit: "quả", quantity: 1, store: "Coop Food", category: "Gia vị", image: "https://images.unsplash.com/photo-1588252393774-c116b9dc9c1c?q=80&w=400&auto=format&fit=crop" },
    ],
    instructions: [
      "Rau muống nhặt sạch bỏ phần cọng già xơ, rửa nhiều lần với nước rồi để ráo.",
      "Tỏi khô bóc vỏ đập dập một nửa, băm nhỏ một nửa còn lại.",
      "Đun nồi nước sôi, chần nhanh rau muống với nhúm muối nhỏ rồi vớt ra ngâm nước đá lạnh.",
      "Đun dầu ăn nóng trên chảo phi thơm phần tỏi băm nhỏ vàng chín.",
      "Trút rau muống ráo nước vào xào nhanh tay trên lửa cực lớn để rau luôn xanh mướt.",
      "Nêm nếm gia vị nước mắm, xíu muối đường vừa ăn, tắt bếp rắc tỏi đập dập và lát ớt lên đảo đều."
    ],
  },
];

// ── Siêu thị ──────────────────────────────────────────────────

export interface StoreInfo {
  id: string;
  name: Store;
  color: string;
  logo: string;
}

export const stores: StoreInfo[] = [
  { id: "store-1", name: "Bach Hoa Xanh", color: "#4CAF50", logo: "/images/bhx-logo.png" },
  { id: "store-2", name: "Winmart", color: "#FF6F00", logo: "/images/winmart-logo.png" },
  { id: "store-3", name: "Coop Food", color: "#1565C0", logo: "/images/coop-logo.png" },
];

// ── Kho đồ có sẵn của người dùng (Pantry) ─────────────────────

export const defaultPantryIngredients: string[] = [
  "Muối",
  "Đường",
  "Tiêu đen",
  "Dầu ăn",
  "Nước mắm",
  "Nước tương",
  "Tỏi",
  "Gạo",
];
