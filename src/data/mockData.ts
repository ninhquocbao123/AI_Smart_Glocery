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
  active?: boolean;
  cookingGuide?: {
    baseServings: number;
    measures: { ingredientId: string; name: string; quantity: number; unit: string }[];
    pantry: { name: string; quantity: number; unit: string }[];
    waiting: string;
    equipment: string[];
    finish: string;
    steps: { title: string; duration: string; heat: string; detail: string; cue: string }[];
  };
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

// Small everyday dishes for student budgets. Prices are illustrative VND per unit.
const everyday: {title:string;items:[string,number,string,number,string][];steps:string[]}[] = [
  {title:"Đậu hũ sốt cà chua",items:[["Đậu hũ",5000,"miếng",3,"Đạm"],["Cà chua",4000,"quả",2,"Rau củ"],["Dầu ăn",1000,"phần",1,"Gia vị"],["Muối",500,"phần",1,"Gia vị"]],steps:["Rửa cà chua, thái nhỏ; cắt đậu hũ thành miếng.","Chiên đậu vàng nhẹ, lấy ra đĩa.","Xào cà chua với ít dầu, thêm nước và muối.","Cho đậu vào sốt, đun nhỏ lửa 5 phút rồi dùng nóng."]},
  {title:"Trứng chiên hành",items:[["Trứng",3500,"quả",4,"Đạm"],["Hành lá",2000,"phần",1,"Rau thơm"],["Dầu ăn",1000,"phần",1,"Gia vị"]],steps:["Rửa và thái hành lá.","Đánh trứng cùng hành và chút muối.","Đun nóng dầu, đổ trứng vào chảo.","Chiên chín đều hai mặt rồi cắt miếng."]},
  {title:"Canh bí xanh",items:[["Bí xanh",12000,"phần",1,"Rau củ"],["Hành lá",2000,"phần",1,"Rau thơm"],["Muối",500,"phần",1,"Gia vị"]],steps:["Gọt vỏ bí, bỏ ruột và thái miếng.","Đun nước sôi, cho bí vào nấu mềm.","Nêm muối, thêm hành rồi tắt bếp."]},
  {title:"Rau cải xào tỏi",items:[["Rau cải",12000,"bó",1,"Rau củ"],["Tỏi",3000,"củ",1,"Gia vị"],["Dầu ăn",1000,"phần",1,"Gia vị"]],steps:["Nhặt rau, rửa sạch và để ráo.","Phi tỏi trong dầu nóng.","Cho rau vào xào, nêm chút muối và đảo đến chín."]},
  {title:"Thịt băm rang",items:[["Thịt heo băm",140,"gram",200,"Đạm"],["Hành tím",3000,"củ",1,"Gia vị"],["Nước mắm",1000,"phần",1,"Gia vị"]],steps:["Bóc vỏ và băm hành tím.","Phi hành, cho thịt vào đảo tơi.","Thêm nước mắm, rang đến khi thịt chín hoàn toàn."]},
  {title:"Canh cà chua trứng",items:[["Cà chua",4000,"quả",2,"Rau củ"],["Trứng",3500,"quả",2,"Đạm"],["Hành lá",2000,"phần",1,"Rau thơm"]],steps:["Rửa và thái cà chua, hành lá.","Xào cà chua rồi thêm nước, đun sôi.","Rót trứng đã đánh vào, khuấy nhẹ.","Nấu trứng chín, nêm muối rồi rắc hành."]},
];
everyday.forEach((dish,index)=>{
  const n=String(index+11).padStart(3,"0");
  const ingredients:Ingredient[]=dish.items.map(([name,price,unit,quantity,category],i)=>({id:`i-${n}-${i+1}`,name,price,unit,quantity,category,store:"Bach Hoa Xanh",image:""}));
  recipes.push({id:`recipe-${n}`,title:dish.title,description:"Món cơm nhà dễ nấu, phù hợp ngân sách sinh viên.",image:"",prepTime:10,cookTime:15,servings:2,difficulty:"Dễ",cuisine:"Việt Nam",tags:["tiết kiệm","cơm nhà"],totalPrice:0,ingredients,instructions:dish.steps});
});
recipes.forEach(recipe=>{recipe.totalPrice=recipe.ingredients.reduce((sum,i)=>sum+i.price*i.quantity,0);});

export const DEALS_DATA: {id:string;ingredientId:string;name:string;price:number;originalPrice:number;unit:string;store:Store;category:string;image:string;expiresIn:string}[] = [
  {id:"d1",ingredientId:"deal-001",name:"Thịt bò tươi",price:95000,originalPrice:120000,unit:"khay",store:"Winmart",category:"Đạm",image:"🥩",expiresIn:"24 giờ"},
  {id:"d2",ingredientId:"deal-002",name:"Cà chua",price:15000,originalPrice:22000,unit:"kg",store:"Bach Hoa Xanh",category:"Rau củ",image:"🍅",expiresIn:"24 giờ"},
  {id:"d3",ingredientId:"deal-003",name:"Trứng gà",price:25000,originalPrice:32000,unit:"hộp",store:"Coop Food",category:"Đạm",image:"🥚",expiresIn:"48 giờ"},
  {id:"d4",ingredientId:"deal-004",name:"Rau cải",price:8000,originalPrice:12000,unit:"bó",store:"Bach Hoa Xanh",category:"Rau củ",image:"🥬",expiresIn:"24 giờ"},
  {id:"d5",ingredientId:"deal-005",name:"Đậu hũ",price:4000,originalPrice:6000,unit:"miếng",store:"Winmart",category:"Đạm",image:"🥢",expiresIn:"24 giờ"},
  {id:"d6",ingredientId:"deal-006",name:"Gạo",price:75000,originalPrice:90000,unit:"túi",store:"Coop Food",category:"Tinh bột",image:"🍚",expiresIn:"72 giờ"},
];

// BEGIN EXPANDED EXE202 CATALOG
recipes.push(...[
  {
    "id": "recipe-017",
    "title": "Cá kho tiêu",
    "description": "Cá kho tiêu – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 35,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-017-1",
        "name": "Cá basa",
        "price": 65000,
        "unit": "kg",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-017-2",
        "name": "Tiêu",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-017-3",
        "name": "Nước mắm",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Rửa cá, cắt khúc và để ráo.",
      "Ướp cá với tiêu và nước mắm 15 phút.",
      "Thêm ít nước, kho nhỏ lửa đến khi cá chín và nước sánh."
    ],
    "totalPrice": 69000
  },
  {
    "id": "recipe-018",
    "title": "Gà kho gừng",
    "description": "Gà kho gừng – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 35,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-018-1",
        "name": "Thịt gà",
        "price": 45000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-018-2",
        "name": "Gừng",
        "price": 3000,
        "unit": "củ",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-018-3",
        "name": "Nước mắm",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Rửa gà, cắt miếng vừa ăn.",
      "Ướp gà với gừng thái sợi và nước mắm.",
      "Xào săn, thêm nước và kho đến chín kỹ."
    ],
    "totalPrice": 50000
  },
  {
    "id": "recipe-019",
    "title": "Canh chua cá",
    "description": "Canh chua cá – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-019-1",
        "name": "Cá diêu hồng",
        "price": 45000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-019-2",
        "name": "Cà chua",
        "price": 4000,
        "unit": "quả",
        "quantity": 2,
        "store": "Bach Hoa Xanh",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-019-3",
        "name": "Dứa",
        "price": 8000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-019-4",
        "name": "Me",
        "price": 3000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Sơ chế cá và rau, dầm me lấy nước chua.",
      "Đun nước me, cho cá vào nấu chín.",
      "Thêm cà chua và dứa, nêm vừa ăn rồi đun thêm vài phút."
    ],
    "totalPrice": 64000
  },
  {
    "id": "recipe-020",
    "title": "Thịt kho trứng",
    "description": "Thịt kho trứng – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 35,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-020-1",
        "name": "Thịt heo",
        "price": 40000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-020-2",
        "name": "Trứng",
        "price": 3500,
        "unit": "quả",
        "quantity": 3,
        "store": "Winmart",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-020-3",
        "name": "Nước mắm",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Luộc trứng chín rồi bóc vỏ.",
      "Thái thịt, ướp nước mắm và chút đường.",
      "Kho thịt cùng nước, thêm trứng rồi đun nhỏ lửa đến mềm."
    ],
    "totalPrice": 52500
  },
  {
    "id": "recipe-021",
    "title": "Cơm chiên rau củ",
    "description": "Cơm chiên rau củ – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-021-1",
        "name": "Cơm nguội",
        "price": 10000,
        "unit": "phần",
        "quantity": 2,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-021-2",
        "name": "Cà rốt",
        "price": 5000,
        "unit": "củ",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-021-3",
        "name": "Đậu Hà Lan",
        "price": 8000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-021-4",
        "name": "Dầu ăn",
        "price": 1000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Cắt nhỏ cà rốt, rửa đậu.",
      "Xào rau củ đến gần chín.",
      "Thêm cơm, đảo tơi và nêm muối; chiên đến nóng đều."
    ],
    "totalPrice": 34000
  },
  {
    "id": "recipe-022",
    "title": "Mướp xào trứng",
    "description": "Mướp xào trứng – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-022-1",
        "name": "Mướp",
        "price": 7000,
        "unit": "quả",
        "quantity": 2,
        "store": "Coop Food",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-022-2",
        "name": "Trứng",
        "price": 3500,
        "unit": "quả",
        "quantity": 3,
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-022-3",
        "name": "Dầu ăn",
        "price": 1000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Gọt mướp, rửa và thái miếng.",
      "Chiên trứng vừa se rồi lấy ra.",
      "Xào mướp, thêm trứng, nêm và đảo đến chín."
    ],
    "totalPrice": 25500
  },
  {
    "id": "recipe-023",
    "title": "Canh rau ngót thịt băm",
    "description": "Canh rau ngót thịt băm – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-023-1",
        "name": "Rau ngót",
        "price": 8000,
        "unit": "bó",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-023-2",
        "name": "Thịt heo băm",
        "price": 140,
        "unit": "gram",
        "quantity": 150,
        "store": "Winmart",
        "category": "Đạm",
        "image": ""
      }
    ],
    "instructions": [
      "Nhặt và rửa sạch rau ngót.",
      "Xào thịt băm, thêm nước đun sôi.",
      "Cho rau vào, nấu chín và nêm vừa ăn."
    ],
    "totalPrice": 29000
  },
  {
    "id": "recipe-024",
    "title": "Đậu hũ chiên sả",
    "description": "Đậu hũ chiên sả – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-024-1",
        "name": "Đậu hũ",
        "price": 5000,
        "unit": "miếng",
        "quantity": 3,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-024-2",
        "name": "Sả",
        "price": 3000,
        "unit": "nhánh",
        "quantity": 2,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-024-3",
        "name": "Dầu ăn",
        "price": 1000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Cắt đậu hũ, băm sả.",
      "Chiên đậu vàng các mặt rồi lấy ra.",
      "Phi sả, trộn đậu với chút muối và đảo đều."
    ],
    "totalPrice": 22000
  },
  {
    "id": "recipe-025",
    "title": "Bắp cải xào cà rốt",
    "description": "Bắp cải xào cà rốt – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-025-1",
        "name": "Bắp cải",
        "price": 12000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-025-2",
        "name": "Cà rốt",
        "price": 5000,
        "unit": "củ",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-025-3",
        "name": "Tỏi",
        "price": 3000,
        "unit": "củ",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Rửa bắp cải và cà rốt, thái sợi.",
      "Phi tỏi, xào cà rốt trước.",
      "Thêm bắp cải, nêm muối và xào chín vừa."
    ],
    "totalPrice": 20000
  },
  {
    "id": "recipe-026",
    "title": "Tôm rim mặn ngọt",
    "description": "Tôm rim mặn ngọt – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-026-1",
        "name": "Tôm",
        "price": 50000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-026-2",
        "name": "Hành tím",
        "price": 3000,
        "unit": "củ",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-026-3",
        "name": "Nước mắm",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Làm sạch tôm, bỏ chỉ lưng.",
      "Phi hành rồi cho tôm vào đảo.",
      "Thêm nước mắm, chút đường và rim đến tôm chín đỏ."
    ],
    "totalPrice": 55000
  },
  {
    "id": "recipe-027",
    "title": "Trứng hấp thịt",
    "description": "Trứng hấp thịt – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-027-1",
        "name": "Trứng",
        "price": 3500,
        "unit": "quả",
        "quantity": 3,
        "store": "Winmart",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-027-2",
        "name": "Thịt heo băm",
        "price": 140,
        "unit": "gram",
        "quantity": 150,
        "store": "Coop Food",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-027-3",
        "name": "Hành lá",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Trộn trứng với thịt băm và hành thái nhỏ.",
      "Nêm vừa ăn, đổ vào bát chịu nhiệt.",
      "Hấp đến khi thịt và trứng chín hoàn toàn."
    ],
    "totalPrice": 33500
  },
  {
    "id": "recipe-028",
    "title": "Canh nấm đậu hũ",
    "description": "Canh nấm đậu hũ – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-028-1",
        "name": "Nấm",
        "price": 15000,
        "unit": "phần",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-028-2",
        "name": "Đậu hũ",
        "price": 5000,
        "unit": "miếng",
        "quantity": 2,
        "store": "Bach Hoa Xanh",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-028-3",
        "name": "Hành lá",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Rửa nấm, cắt đậu và hành.",
      "Đun nước sôi, thêm nấm rồi đậu.",
      "Nấu chín, nêm muối và thêm hành."
    ],
    "totalPrice": 27000
  },
  {
    "id": "recipe-029",
    "title": "Sườn xào chua ngọt",
    "description": "Sườn xào chua ngọt – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 35,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-029-1",
        "name": "Sườn heo",
        "price": 45000,
        "unit": "phần",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": ""
      },
      {
        "id": "i-029-2",
        "name": "Cà chua",
        "price": 4000,
        "unit": "quả",
        "quantity": 2,
        "store": "Winmart",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-029-3",
        "name": "Hành tây",
        "price": 5000,
        "unit": "củ",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Sơ chế sườn, chần rồi rửa sạch.",
      "Chiên sườn săn, xào cà chua và hành.",
      "Thêm sườn với nước chua ngọt, đun đến chín mềm."
    ],
    "totalPrice": 58000
  },
  {
    "id": "recipe-030",
    "title": "Mì xào rau củ",
    "description": "Mì xào rau củ – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.",
    "image": "",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "difficulty": "Dễ",
    "cuisine": "Việt Nam",
    "tags": [
      "cơm nhà",
      "món Việt"
    ],
    "ingredients": [
      {
        "id": "i-030-1",
        "name": "Mì",
        "price": 5000,
        "unit": "gói",
        "quantity": 2,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      },
      {
        "id": "i-030-2",
        "name": "Rau cải",
        "price": 10000,
        "unit": "bó",
        "quantity": 1,
        "store": "Coop Food",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-030-3",
        "name": "Cà rốt",
        "price": 5000,
        "unit": "củ",
        "quantity": 1,
        "store": "Bach Hoa Xanh",
        "category": "Rau củ",
        "image": ""
      },
      {
        "id": "i-030-4",
        "name": "Nước tương",
        "price": 2000,
        "unit": "phần",
        "quantity": 1,
        "store": "Winmart",
        "category": "Gia vị",
        "image": ""
      }
    ],
    "instructions": [
      "Chần mì và để ráo.",
      "Rửa rau, thái cà rốt, xào gần chín.",
      "Cho mì vào, thêm nước tương và đảo nóng đều."
    ],
    "totalPrice": 27000
  }
] as Recipe[]);
DEALS_DATA.push(...[
  {
    "id": "d7",
    "ingredientId": "deal-007",
    "name": "Thịt gà",
    "price": 39000,
    "originalPrice": 49000,
    "unit": "khay",
    "category": "Đạm",
    "store": "Bach Hoa Xanh",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d8",
    "ingredientId": "deal-008",
    "name": "Cá basa",
    "price": 45000,
    "originalPrice": 59000,
    "unit": "khay",
    "category": "Đạm",
    "store": "Winmart",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d9",
    "ingredientId": "deal-009",
    "name": "Tôm tươi",
    "price": 69000,
    "originalPrice": 85000,
    "unit": "khay",
    "category": "Đạm",
    "store": "Coop Food",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d10",
    "ingredientId": "deal-010",
    "name": "Sườn heo",
    "price": 59000,
    "originalPrice": 72000,
    "unit": "khay",
    "category": "Đạm",
    "store": "Bach Hoa Xanh",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d11",
    "ingredientId": "deal-011",
    "name": "Nấm đùi gà",
    "price": 19000,
    "originalPrice": 25000,
    "unit": "gói",
    "category": "Rau củ",
    "store": "Winmart",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d12",
    "ingredientId": "deal-012",
    "name": "Bắp cải",
    "price": 12000,
    "originalPrice": 18000,
    "unit": "bắp",
    "category": "Rau củ",
    "store": "Coop Food",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d13",
    "ingredientId": "deal-013",
    "name": "Cà rốt",
    "price": 15000,
    "originalPrice": 22000,
    "unit": "kg",
    "category": "Rau củ",
    "store": "Bach Hoa Xanh",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d14",
    "ingredientId": "deal-014",
    "name": "Bí xanh",
    "price": 14000,
    "originalPrice": 20000,
    "unit": "kg",
    "category": "Rau củ",
    "store": "Winmart",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d15",
    "ingredientId": "deal-015",
    "name": "Dưa leo",
    "price": 12000,
    "originalPrice": 17000,
    "unit": "kg",
    "category": "Rau củ",
    "store": "Coop Food",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d16",
    "ingredientId": "deal-016",
    "name": "Hành tây",
    "price": 18000,
    "originalPrice": 24000,
    "unit": "kg",
    "category": "Rau củ",
    "store": "Bach Hoa Xanh",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d17",
    "ingredientId": "deal-017",
    "name": "Dầu ăn",
    "price": 35000,
    "originalPrice": 42000,
    "unit": "chai",
    "category": "Gia vị",
    "store": "Winmart",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d18",
    "ingredientId": "deal-018",
    "name": "Nước mắm",
    "price": 28000,
    "originalPrice": 35000,
    "unit": "chai",
    "category": "Gia vị",
    "store": "Coop Food",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d19",
    "ingredientId": "deal-019",
    "name": "Mì trứng",
    "price": 16000,
    "originalPrice": 22000,
    "unit": "gói",
    "category": "Tinh bột",
    "store": "Bach Hoa Xanh",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  },
  {
    "id": "d20",
    "ingredientId": "deal-020",
    "name": "Sữa tươi",
    "price": 27000,
    "originalPrice": 33000,
    "unit": "hộp",
    "category": "Sữa",
    "store": "Winmart",
    "image": "",
    "expiresIn": "Ưu đãi minh họa"
  }
] as typeof DEALS_DATA);
recipes.forEach(r=>{r.image='/images/food/'+r.id+'.webp';r.ingredients.forEach(i=>{i.image='/images/catalog/'+i.id+'.svg';});});
DEALS_DATA.forEach(d=>{d.image='/images/food/'+d.ingredientId+'.webp';});

// BEGIN DETAILED COOKING GUIDES
const cookingPatches = [
  {
    "id": "recipe-001",
    "prepTime": 30,
    "cookTime": 180,
    "cookingGuide": {
      "baseServings": 4,
      "measures": [
        {
          "ingredientId": "i-001-1",
          "name": "Nạm bò",
          "quantity": 500,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-2",
          "name": "Xương bò",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-3",
          "name": "Bánh phở",
          "quantity": 600,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-4",
          "name": "Hoa hồi",
          "quantity": 3,
          "unit": "bông"
        },
        {
          "ingredientId": "i-001-5",
          "name": "Thanh quế",
          "quantity": 2,
          "unit": "thanh"
        },
        {
          "ingredientId": "i-001-6",
          "name": "Hành tây",
          "quantity": 2,
          "unit": "củ"
        },
        {
          "ingredientId": "i-001-7",
          "name": "Gừng",
          "quantity": 30,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-8",
          "name": "Giá đỗ",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-9",
          "name": "Rau húng quế",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-001-10",
          "name": "Nước mắm",
          "quantity": 30,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 2200,
          "unit": "ml"
        },
        {
          "name": "Muối",
          "quantity": 4,
          "unit": "g"
        },
        {
          "name": "Đường",
          "quantity": 8,
          "unit": "g"
        },
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi 4–5 lít",
        "Rây lọc",
        "Dao, thớt riêng cho thịt",
        "Nhiệt kế thực phẩm"
      ],
      "finish": "Nước dùng trong màu hổ phách nhạt; nạm mềm thái mỏng, bánh phở tơi, rau đặt trên mặt tô.",
      "steps": [
        {
          "title": "Sơ chế xương và rau",
          "duration": "10 phút",
          "heat": "Lửa lớn",
          "detail": "Chần xương trong nước sôi 5 phút, bỏ nước chần rồi làm sạch cặn bám. Rửa giá, húng quế, hành lá; để ráo. Để riêng nạm bò và dụng cụ tiếp xúc thịt sống.",
          "cue": "Xương sạch cặn, rau ráo nước."
        },
        {
          "title": "Làm thơm gia vị",
          "duration": "8–10 phút",
          "heat": "Lửa vừa",
          "detail": "Áp chảo hành tây bổ đôi và gừng đập dập cho xém mặt; cạo phần cháy đen. Rang hồi, quế 1–2 phút rồi cho vào túi lọc.",
          "cue": "Gia vị thơm, không khét hoặc cháy đen."
        },
        {
          "title": "Ninh nước dùng và nạm",
          "duration": "150–180 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho xương, nạm, hành gừng và lượng nước trong mục gia vị vào nồi. Đun sôi, hớt bọt rồi hạ lửa chỉ sôi lăn tăn. Sau 60–90 phút kiểm tra nạm, vớt khi mềm; tiếp tục ninh xương. Nếu cạn nhiều, thêm nước nóng để trở lại mức ban đầu.",
          "cue": "Nạm xiên dễ, nước dùng không sôi cuộn đục; thịt đạt ít nhất 63°C và nghỉ 3 phút."
        },
        {
          "title": "Lọc và nêm nước dùng",
          "duration": "8 phút",
          "heat": "Lửa nhỏ",
          "detail": "Lọc bỏ xương và gia vị. Thêm một nửa nước mắm, muối và đường đã định lượng; nếm rồi thêm dần phần còn lại. Giữ nước dùng nóng. Nạm nguội bớt thì thái ngang thớ dày khoảng 2 mm.",
          "cue": "Nước thơm hồi quế, vị đậm nhẹ để dùng với bánh phở."
        },
        {
          "title": "Chuẩn bị từng tô",
          "duration": "3 phút",
          "heat": "Lửa lớn",
          "detail": "Chần bánh phở theo hướng dẫn trên bao bì, vẩy ráo rồi chia tô. Chần giá nếu thích ăn chín. Xếp nạm thái mỏng và hành lá lên bánh phở.",
          "cue": "Bánh phở nóng, không dính thành khối."
        },
        {
          "title": "Chan nước và trình bày",
          "duration": "2 phút",
          "heat": "Tắt bếp",
          "detail": "Chan nước dùng nóng ngập bánh phở; đặt giá và húng quế lên trên hoặc để đĩa riêng. Dùng ngay khi nóng.",
          "cue": "Tô có lớp bánh phở phía dưới, lát bò trên mặt và điểm xanh của rau."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-002",
    "prepTime": 30,
    "cookTime": 40,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-002-1",
          "name": "Gạo tấm",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-002-2",
          "name": "Sườn heo",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-002-3",
          "name": "Bì heo",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-002-4",
          "name": "Trứng gà",
          "quantity": 3,
          "unit": "quả"
        },
        {
          "ingredientId": "i-002-5",
          "name": "Sả",
          "quantity": 3,
          "unit": "nhánh"
        },
        {
          "ingredientId": "i-002-6",
          "name": "Tỏi",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-002-7",
          "name": "Mỡ hành",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "ingredientId": "i-002-8",
          "name": "Đồ chua",
          "quantity": 80,
          "unit": "g"
        },
        {
          "ingredientId": "recipe-002-extra-1",
          "name": "Thịt heo băm",
          "quantity": 100,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Miến khô",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Mộc nhĩ khô",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Nước mắm",
          "quantity": 30,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 20,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Chanh",
          "quantity": 1,
          "unit": "quả"
        },
        {
          "name": "Dưa leo",
          "quantity": 100,
          "unit": "g"
        },
        {
          "name": "Cà chua",
          "quantity": 100,
          "unit": "g"
        },
        {
          "name": "Tiêu",
          "quantity": 1,
          "unit": "g"
        },
        {
          "name": "Thính gạo",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Nước pha mắm",
          "quantity": 60,
          "unit": "ml"
        }
      ],
      "waiting": "Ướp sườn 30 phút trong ngăn mát",
      "equipment": [
        "Nồi cơm",
        "Chảo nướng hoặc lò",
        "Xửng hấp",
        "Nhiệt kế thực phẩm"
      ],
      "finish": "Cơm tấm trắng tơi, sườn vàng nâu, bì tơi và chả cắt miếng; rau và chén mắm đặt bên cạnh.",
      "steps": [
        {
          "title": "Chuẩn bị cơm và đồ chua",
          "duration": "10 phút",
          "heat": "Chưa bật bếp",
          "detail": "Vo gạo nhẹ, nấu theo tỷ lệ nước trên bao bì. Miến và mộc nhĩ ngâm mềm, để ráo rồi cắt nhỏ. Rửa dưa leo, cà chua và thái lát; để đồ chua ráo.",
          "cue": "Nguyên liệu ráo; miến mềm nhưng chưa nhũn."
        },
        {
          "title": "Ướp sườn",
          "duration": "30 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Đập nhẹ miếng sườn dày 1–1,5 cm. Trộn với sả băm, nửa tỏi, một phần ba nước mắm, một phần ba đường, dầu ăn và tiêu. Đậy kín, ướp trong ngăn mát.",
          "cue": "Gia vị phủ đều hai mặt sườn."
        },
        {
          "title": "Hấp chả",
          "duration": "25–30 phút",
          "heat": "Lửa vừa",
          "detail": "Trộn thịt băm, miến, mộc nhĩ với 2 trứng và lòng trắng của trứng còn lại; nêm chút nước mắm từ phần đã chuẩn bị. Cho vào khuôn chịu nhiệt có quét dầu. Hấp, kiểm tra giữa chả đạt 71°C; quét lòng đỏ còn lại lên mặt, hấp thêm 3–5 phút.",
          "cue": "Chả chắc, mặt vàng; giữa chả đã chín, không còn hỗn hợp trứng sống."
        },
        {
          "title": "Luộc và trộn bì",
          "duration": "20–30 phút",
          "heat": "Lửa vừa",
          "detail": "Luộc bì đã làm sạch đến mềm nhưng còn giòn, để nguội rồi thái sợi thật mỏng. Trộn với thính và phần tỏi còn lại. Không dùng thớt vừa cắt sườn sống cho bì chín.",
          "cue": "Bì sợi tơi, không còn mỡ dày bám ngoài."
        },
        {
          "title": "Nướng sườn",
          "duration": "15–20 phút",
          "heat": "Lò 200°C",
          "detail": "Làm nóng lò; xếp sườn một lớp, nướng và trở mặt giữa chừng. Hoặc áp chảo lửa vừa, trở khi mặt dưới đã vàng. Đo phần thịt dày đạt 63°C, để nghỉ 3 phút trước khi cắt.",
          "cue": "Mặt sườn vàng nâu, không cháy đen; thời gian điều chỉnh theo độ dày."
        },
        {
          "title": "Pha mắm và dọn cơm",
          "duration": "5 phút",
          "heat": "Tắt bếp",
          "detail": "Hòa nước pha mắm, lượng nước mắm và đường còn lại; thêm nước cốt chanh từng ít, nếm vị chua ngọt. Xới cơm, xếp sườn, bì, chả, dưa leo, cà chua và đồ chua, rưới mỡ hành lên cơm.",
          "cue": "Các phần nằm riêng trên đĩa, sườn hướng mặt vàng lên trên."
        }
      ]
    },
    "additions": [
      {
        "id": "recipe-002-extra-1",
        "name": "Thịt heo băm",
        "quantity": 100,
        "price": 140,
        "unit": "g",
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": "/images/catalog/i-015-1.svg"
      }
    ]
  },
  {
    "id": "recipe-003",
    "prepTime": 25,
    "cookTime": 20,
    "cookingGuide": {
      "baseServings": 3,
      "measures": [
        {
          "ingredientId": "i-003-1",
          "name": "Thịt lợn xay",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-2",
          "name": "Thịt ba chỉ",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-3",
          "name": "Bún tươi",
          "quantity": 600,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-4",
          "name": "Nước mắm",
          "quantity": 45,
          "unit": "ml"
        },
        {
          "ingredientId": "i-003-5",
          "name": "Đường",
          "quantity": 30,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-6",
          "name": "Chanh",
          "quantity": 3,
          "unit": "quả"
        },
        {
          "ingredientId": "i-003-7",
          "name": "Rau xà lách",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-8",
          "name": "Rau thơm các loại",
          "quantity": 40,
          "unit": "g"
        },
        {
          "ingredientId": "i-003-9",
          "name": "Tỏi",
          "quantity": 15,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Hành tím",
          "quantity": 20,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 1,
          "unit": "g"
        },
        {
          "name": "Cà rốt",
          "quantity": 100,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 180,
          "unit": "ml"
        }
      ],
      "waiting": "Ướp thịt 30 phút trong ngăn mát",
      "equipment": [
        "Chảo nướng hoặc lò",
        "Bát pha nước chấm",
        "Nhiệt kế thực phẩm"
      ],
      "finish": "Chả viên và ba chỉ xém cạnh trong bát nước mắm chua ngọt; bún và rau để riêng.",
      "steps": [
        {
          "title": "Sơ chế",
          "duration": "10 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa rau rồi để ráo. Băm hành, tỏi; thái ba chỉ lát dày 4–5 mm, cà rốt lát mỏng. Bún chần theo bao bì nếu cần, để ráo.",
          "cue": "Thịt và rau dùng dụng cụ riêng."
        },
        {
          "title": "Ướp hai loại thịt",
          "duration": "30 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Chia hành tỏi cho thịt xay và ba chỉ. Dùng một phần ba nước mắm, một phần ba đường, dầu và tiêu ướp cả hai phần; để ngăn mát. Nặn thịt xay thành viên dẹt dày khoảng 1,5 cm.",
          "cue": "Viên chả đều độ dày để chín cùng lúc."
        },
        {
          "title": "Pha nước chấm",
          "duration": "5 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Hòa nước với đường và nước mắm còn lại; thêm nước cốt chanh từng ít, nếm chua ngọt dịu. Thêm cà rốt thái mỏng; giữ rau ăn kèm ở đĩa riêng.",
          "cue": "Nước chấm loãng vừa, không mặn như nước mắm nguyên chất."
        },
        {
          "title": "Nướng chả",
          "duration": "12–18 phút",
          "heat": "Lửa vừa hoặc lò 200°C",
          "detail": "Nướng chả viên và ba chỉ thành một lớp, trở đều. Chả xay phải đạt 71°C ở giữa; ba chỉ đạt ít nhất 63°C rồi nghỉ 3 phút. Gắp miếng đã chín ra, không để chờ miếng dày hơn.",
          "cue": "Chả nâu vàng, có cạnh xém nhẹ, không cháy đen."
        },
        {
          "title": "Hoàn thiện bát chả",
          "duration": "2 phút",
          "heat": "Tắt bếp",
          "detail": "Cho chả nóng vào từng bát nước chấm đã pha. Đặt cà rốt quanh chả; chỉ cho lượng vừa dùng để chả không ngâm quá lâu.",
          "cue": "Thấy rõ cả chả viên và miếng ba chỉ trong bát."
        },
        {
          "title": "Thưởng thức",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Dọn bún tơi, xà lách và rau thơm bên cạnh. Gắp từng phần bún, rau vào bát chả; ăn ngay khi chả còn ấm.",
          "cue": "Bún không ngập sẵn trong bát để giữ độ tơi."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-004",
    "prepTime": 25,
    "cookTime": 20,
    "cookingGuide": {
      "baseServings": 4,
      "measures": [
        {
          "ingredientId": "i-004-1",
          "name": "Bánh tráng",
          "quantity": 12,
          "unit": "tờ"
        },
        {
          "ingredientId": "i-004-2",
          "name": "Tôm tươi",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-004-3",
          "name": "Thịt thăn heo",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-004-4",
          "name": "Bún tươi",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-004-5",
          "name": "Rau xà lách",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-004-6",
          "name": "Rau húng lủi",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-004-7",
          "name": "Tương đen",
          "quantity": 60,
          "unit": "ml"
        },
        {
          "ingredientId": "i-004-8",
          "name": "Đậu phộng",
          "quantity": 25,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước pha sốt",
          "quantity": 60,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Tỏi",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        }
      ],
      "waiting": "Để tôm và thịt nguội bớt trước khi cuốn",
      "equipment": [
        "Nồi nhỏ",
        "Thớt sạch cho đồ chín",
        "Chảo sốt"
      ],
      "finish": "Cuốn chặt vừa tay, nhìn thấy tôm hồng qua lớp bánh tráng; rau xanh ở phần đầu.",
      "steps": [
        {
          "title": "Chuẩn bị rau và bún",
          "duration": "8 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa xà lách, húng lủi, để thật ráo. Bún chần theo bao bì nếu cần rồi để nguội; bánh tráng để khô trên đĩa.",
          "cue": "Rau không đọng nước làm rách cuốn."
        },
        {
          "title": "Luộc thịt",
          "duration": "15–20 phút",
          "heat": "Lửa vừa",
          "detail": "Cho thịt vào nước vừa ngập, luộc sôi nhẹ. Kiểm tra phần dày đạt 63°C, vớt ra nghỉ ít nhất 3 phút rồi thái lát mỏng ngang thớ.",
          "cue": "Lát thịt mỏng, đều, không dùng lại thớt thịt sống."
        },
        {
          "title": "Luộc tôm",
          "duration": "3–5 phút",
          "heat": "Lửa vừa",
          "detail": "Luộc tôm đến thịt trắng đục và đạt 63°C. Vớt ra, để nguội bớt, bóc vỏ, bỏ chỉ lưng rồi chẻ đôi dọc thân.",
          "cue": "Hai nửa tôm gọn, lưng hồng đẹp."
        },
        {
          "title": "Nấu sốt",
          "duration": "3–4 phút",
          "heat": "Lửa nhỏ",
          "detail": "Phi tỏi với dầu, cho tương đen, nước pha sốt và đường vào khuấy. Đun sôi nhẹ đến hơi sánh; rắc đậu phộng giã lên mặt khi múc ra bát.",
          "cue": "Sốt chảy chậm khỏi thìa, không đặc quánh."
        },
        {
          "title": "Cuốn",
          "duration": "10 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Làm ẩm nhanh từng bánh tráng, đặt lên đĩa. Xếp rau, bún, thịt ở một phần ba phía dưới; gập hai mép vào rồi cuốn một vòng. Đặt 2 nửa tôm phía trước, mặt hồng úp xuống bánh, cuốn tiếp đến hết.",
          "cue": "Mặt ngoài thấy tôm; cuốn kín hai đầu nhưng không siết rách bánh."
        },
        {
          "title": "Dọn món",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Xếp cuốn cách nhau trên đĩa để không dính; dùng ngay với sốt. Đậu phộng để riêng nếu người ăn cần tránh nguyên liệu này.",
          "cue": "Cuốn bóng mềm, rau tươi, không bị khô mép."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-005",
    "prepTime": 20,
    "cookTime": 15,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-005-1",
          "name": "Bánh mì ổ",
          "quantity": 2,
          "unit": "cái"
        },
        {
          "ingredientId": "i-005-2",
          "name": "Nạc vai heo",
          "quantity": 250,
          "unit": "g"
        },
        {
          "ingredientId": "i-005-3",
          "name": "Sả",
          "quantity": 2,
          "unit": "nhánh"
        },
        {
          "ingredientId": "i-005-4",
          "name": "Củ cải trắng",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredientId": "i-005-5",
          "name": "Củ cà rốt",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredientId": "i-005-6",
          "name": "Dưa leo",
          "quantity": 1,
          "unit": "quả"
        },
        {
          "ingredientId": "i-005-7",
          "name": "Ớt tươi",
          "quantity": 1,
          "unit": "quả"
        },
        {
          "ingredientId": "i-005-8",
          "name": "Rau ngò rí",
          "quantity": 15,
          "unit": "g"
        },
        {
          "ingredientId": "i-005-9",
          "name": "Sốt mayonnaise",
          "quantity": 30,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước mắm",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Giấm",
          "quantity": 30,
          "unit": "ml"
        },
        {
          "name": "Nước",
          "quantity": 30,
          "unit": "ml"
        },
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Tỏi",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Muối",
          "quantity": 1,
          "unit": "g"
        }
      ],
      "waiting": "Ướp thịt và ngâm đồ chua 30 phút",
      "equipment": [
        "Chảo nướng",
        "Dao, thớt",
        "Bát ngâm đồ chua"
      ],
      "finish": "Ổ bánh giòn, thịt nướng vàng, đồ chua, dưa leo và ngò nhìn rõ ở khe bánh.",
      "steps": [
        {
          "title": "Làm đồ chua",
          "duration": "10 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Gọt củ cải, cà rốt rồi thái sợi. Bóp nhẹ với muối, để 5 phút, rửa nhanh và vắt ráo. Hòa giấm, nước và hai phần ba đường, cho rau củ vào ngâm.",
          "cue": "Sợi rau củ giòn, vị chua ngọt nhẹ."
        },
        {
          "title": "Ướp thịt",
          "duration": "30 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Thái nạc vai ngang thớ dày 3–4 mm. Băm sả và tỏi; trộn cùng thịt, nước mắm, dầu và đường còn lại. Đậy kín trong ngăn mát.",
          "cue": "Thịt phủ gia vị đều, không thành cục dày."
        },
        {
          "title": "Chuẩn bị rau ăn kèm",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa dưa leo, ngò và ớt; để ráo. Thái dưa leo thành thanh mỏng, ớt thành lát; để riêng cho người ăn tự chọn.",
          "cue": "Rau ráo để bánh không bị ỉu."
        },
        {
          "title": "Nướng thịt",
          "duration": "8–12 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng chảo, xếp thịt một lớp. Trở khi mặt dưới vàng; nướng đến thịt đạt 63°C ở phần dày rồi để nghỉ 3 phút. Nướng nhiều mẻ nếu chảo chật.",
          "cue": "Thịt nâu vàng, cạnh hơi xém, không đen khét."
        },
        {
          "title": "Làm nóng bánh",
          "duration": "3–5 phút",
          "heat": "Lò 170°C",
          "detail": "Làm nóng ổ bánh trong lò rồi rạch dọc, chừa một cạnh liền. Phết mayonnaise mỏng vào ruột.",
          "cue": "Vỏ giòn, ruột còn mềm."
        },
        {
          "title": "Kẹp và dọn",
          "duration": "3 phút",
          "heat": "Tắt bếp",
          "detail": "Cho dưa leo, thịt, đồ chua đã ráo và ngò vào; thêm ớt theo khẩu vị. Để mặt thịt vàng quay ra khe bánh.",
          "cue": "Nhân trải đều, không chảy nhiều nước xuống đáy bánh."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-006",
    "prepTime": 20,
    "cookTime": 65,
    "cookingGuide": {
      "baseServings": 3,
      "measures": [
        {
          "ingredientId": "i-006-1",
          "name": "Thịt ba chỉ",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-006-2",
          "name": "Nước dừa tươi",
          "quantity": 500,
          "unit": "ml"
        },
        {
          "ingredientId": "i-006-3",
          "name": "Đường",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-006-4",
          "name": "Nước mắm",
          "quantity": 25,
          "unit": "ml"
        },
        {
          "ingredientId": "i-006-5",
          "name": "Hành tím",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-006-6",
          "name": "Tiêu đen",
          "quantity": 1,
          "unit": "g"
        },
        {
          "ingredientId": "i-006-7",
          "name": "Tỏi",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-006-8",
          "name": "Ớt tươi",
          "quantity": 1,
          "unit": "quả"
        },
        {
          "ingredientId": "recipe-006-extra-1",
          "name": "Trứng gà",
          "quantity": 3,
          "unit": "quả"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 200,
          "unit": "ml"
        }
      ],
      "waiting": "Ướp thịt 20 phút trong ngăn mát",
      "equipment": [
        "Nồi đáy dày",
        "Nồi luộc trứng"
      ],
      "finish": "Thịt ba chỉ nâu óng, mềm nhưng nguyên miếng; trứng vàng nhạt nằm trong nước kho.",
      "steps": [
        {
          "title": "Sơ chế và ướp thịt",
          "duration": "20 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Thấm khô thịt, cắt khối 3 cm. Băm hành tỏi, trộn với thịt, nước mắm, tiêu và nửa đường. Ướp trong ngăn mát.",
          "cue": "Miếng thịt đều cỡ, giữ đủ lớp nạc và mỡ."
        },
        {
          "title": "Luộc trứng",
          "duration": "10–12 phút",
          "heat": "Lửa vừa",
          "detail": "Luộc trứng từ khi nước sôi nhẹ 10–12 phút, làm nguội bằng nước sạch rồi bóc vỏ. Giữ trứng nguyên, không cắt trước khi kho.",
          "cue": "Vỏ bóc sạch, trứng không vỡ."
        },
        {
          "title": "Tạo màu",
          "duration": "3–4 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho đường còn lại và một ít nước trong phần định lượng vào nồi. Đun đến màu hổ phách, thêm phần nước còn lại thật chậm để tránh bắn. Không dùng nước màu đã chuyển đen.",
          "cue": "Màu nâu cánh gián, không có mùi khét."
        },
        {
          "title": "Kho thịt",
          "duration": "45–55 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho thịt vào đảo săn, thêm nước dừa và nước màu. Đun sôi, hớt bọt rồi kho hé nắp; trở miếng thịt vài lần. Nếu nước cạn trước khi mềm, thêm nước nóng từng ít.",
          "cue": "Nước chỉ sôi lăn tăn; thịt xiên dễ nhưng không nát."
        },
        {
          "title": "Thêm trứng và nêm",
          "duration": "10 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho trứng vào, trở nhẹ để thấm màu. Nếm nước kho; nếu đậm, thêm ít nước nóng; nếu nhạt, thêm nước mắm từng chút. Thịt phải chín kỹ, tối thiểu 63°C và nghỉ 3 phút.",
          "cue": "Nước kho còn xâm xấp, trứng vàng nhạt, thịt mềm."
        },
        {
          "title": "Trình bày",
          "duration": "2 phút",
          "heat": "Tắt bếp",
          "detail": "Múc thịt và trứng vào tô hoặc nồi đất, rưới nước kho vừa đủ. Rắc tiêu, thêm ớt nếu thích; ăn cùng cơm riêng.",
          "cue": "Mặt thịt bóng, trứng nằm xen kẽ giống bố cục ảnh."
        }
      ]
    },
    "additions": [
      {
        "id": "recipe-006-extra-1",
        "name": "Trứng gà",
        "quantity": 3,
        "price": 3500,
        "unit": "quả",
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": "/images/food/deal-003.webp"
      }
    ]
  },
  {
    "id": "recipe-007",
    "prepTime": 15,
    "cookTime": 10,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-007-1",
          "name": "Thịt thăn bò",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-007-2",
          "name": "Tỏi",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-007-3",
          "name": "Bơ lạt",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-007-4",
          "name": "Nước tương",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "ingredientId": "i-007-5",
          "name": "Dầu hào",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "ingredientId": "i-007-6",
          "name": "Xà lách xoong",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredientId": "i-007-7",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-007-8",
          "name": "Hành tây",
          "quantity": 1,
          "unit": "củ"
        },
        {
          "ingredientId": "i-007-9",
          "name": "Chanh",
          "quantity": 1,
          "unit": "quả"
        }
      ],
      "pantry": [
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 3,
          "unit": "g"
        },
        {
          "name": "Tiêu",
          "quantity": 1,
          "unit": "g"
        }
      ],
      "waiting": "Ướp bò 15 phút trong ngăn mát",
      "equipment": [
        "Chảo rộng đáy dày",
        "Kẹp gắp",
        "Nhiệt kế"
      ],
      "finish": "Thịt bò dạng khối vàng nâu bên ngoài, hành tây còn giòn, rau xanh và cà chua quanh đĩa.",
      "steps": [
        {
          "title": "Cắt và làm ráo",
          "duration": "8 phút",
          "heat": "Chưa bật bếp",
          "detail": "Thấm khô bò, cắt khối 2 cm. Hành tây cắt miếng vuông; rửa xà lách xoong, cà chua, để ráo. Băm tỏi.",
          "cue": "Bề mặt bò khô giúp áp chảo lên màu."
        },
        {
          "title": "Ướp bò",
          "duration": "15 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Trộn bò với nước tương, dầu hào, đường, tiêu và nửa tỏi. Để ngăn mát; lấy ra ngay trước lúc nấu.",
          "cue": "Gia vị bám mỏng, không quá nhiều nước ướp."
        },
        {
          "title": "Xào hành",
          "duration": "2 phút",
          "heat": "Lửa lớn",
          "detail": "Làm nóng chảo với nửa dầu. Cho hành tây vào đảo nhanh rồi trút ra đĩa riêng.",
          "cue": "Hành trong nhẹ ở mép, giữa còn giòn."
        },
        {
          "title": "Áp chảo bò",
          "duration": "5–7 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Thêm dầu còn lại, xếp bò một lớp. Để yên khoảng 1 phút cho vàng rồi trở các mặt. Không nhồi kín chảo. Kiểm tra phần dày đạt 63°C, sau nấu nghỉ 3 phút.",
          "cue": "Bò có mặt nâu vàng; thời gian tùy kích thước và độ nóng chảo."
        },
        {
          "title": "Đảo bơ tỏi",
          "duration": "1 phút",
          "heat": "Lửa vừa",
          "detail": "Hạ lửa, thêm bơ và tỏi còn lại; đảo nhanh cho thơm rồi cho hành tây trở lại, trộn đều. Tắt bếp trước khi bơ cháy.",
          "cue": "Bơ áo bóng thịt, tỏi vàng nhạt."
        },
        {
          "title": "Bày món",
          "duration": "3 phút",
          "heat": "Tắt bếp",
          "detail": "Lót xà lách xoong, xếp cà chua quanh đĩa, đặt bò và hành vào giữa; chanh cắt múi để riêng.",
          "cue": "Khối bò nổi bật ở giữa, rau không bị ngập sốt."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-008",
    "prepTime": 20,
    "cookTime": 20,
    "cookingGuide": {
      "baseServings": 4,
      "measures": [
        {
          "ingredientId": "i-008-1",
          "name": "Cá lóc",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-2",
          "name": "Me chua",
          "quantity": 25,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-3",
          "name": "Thơm (Dứa)",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-4",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-008-5",
          "name": "Đậu bắp",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-6",
          "name": "Giá đỗ",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-7",
          "name": "Rau om (Ngò ôm)",
          "quantity": 15,
          "unit": "g"
        },
        {
          "ingredientId": "i-008-8",
          "name": "Nước mắm",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 1200,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi 2–3 lít",
        "Rây me"
      ],
      "finish": "Canh trong chua dịu, có cá, dứa, cà chua, đậu bắp và giá; rau om rắc trên mặt.",
      "steps": [
        {
          "title": "Chuẩn bị cá và rau",
          "duration": "10 phút",
          "heat": "Chưa bật bếp",
          "detail": "Dùng cá đã làm sạch, cắt khoanh 2–3 cm, thấm ráo; loại bỏ phần máu đọng. Cà chua bổ múi, dứa cắt lát, đậu bắp cắt xéo. Rửa giá và rau om, để riêng.",
          "cue": "Cá và rau dùng thớt riêng, miếng cá đều cỡ."
        },
        {
          "title": "Lấy nước me",
          "duration": "5 phút",
          "heat": "Nước nóng",
          "detail": "Dầm me với một ít nước nóng lấy từ lượng nước đã định, lọc bỏ hạt và xơ. Không đổ cả hạt me vào nồi.",
          "cue": "Nước me mịn, không có hạt cứng."
        },
        {
          "title": "Nấu cá",
          "duration": "8–12 phút",
          "heat": "Lửa vừa",
          "detail": "Đun lượng nước còn lại với dứa, cho cá vào khi nước sôi. Hớt bọt, hạ lửa; tránh đảo mạnh làm vỡ cá. Kiểm tra cá đạt 63°C ở phần dày.",
          "cue": "Thịt cá đục và tách thớ, nước canh ít bọt."
        },
        {
          "title": "Thêm rau và nêm",
          "duration": "4–5 phút",
          "heat": "Lửa vừa",
          "detail": "Cho cà chua, đậu bắp, nửa nước me, nước mắm và đường vào. Nếm rồi thêm nước me còn lại từ từ; thêm muối nếu cần.",
          "cue": "Vị chua ngọt dịu, cà chua còn múi và đậu bắp xanh."
        },
        {
          "title": "Hoàn thiện",
          "duration": "1 phút",
          "heat": "Lửa vừa",
          "detail": "Cho giá vào, đợi nước sôi lại rồi tắt. Rắc rau om và đảo nhẹ một lần.",
          "cue": "Giá còn giòn, rau thơm không thâm đen."
        },
        {
          "title": "Múc canh",
          "duration": "2 phút",
          "heat": "Tắt bếp",
          "detail": "Xếp cá vào tô trước, múc nước và rau quanh cá; đặt vài múi cà chua và dứa trên mặt.",
          "cue": "Cá nguyên khoanh và màu rau rõ như ảnh; chú ý xương khi ăn."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-009",
    "prepTime": 20,
    "cookTime": 45,
    "cookingGuide": {
      "baseServings": 3,
      "measures": [
        {
          "ingredientId": "i-009-1",
          "name": "Gạo nếp",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-009-2",
          "name": "Chicken thigh",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-009-3",
          "name": "Hành tím",
          "quantity": 40,
          "unit": "g"
        },
        {
          "ingredientId": "i-009-4",
          "name": "Hành lá",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-009-5",
          "name": "Dầu ăn",
          "quantity": 30,
          "unit": "ml"
        },
        {
          "ingredientId": "i-009-6",
          "name": "Gừng",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-009-7",
          "name": "Muối",
          "quantity": 3,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước luộc gà",
          "quantity": 1000,
          "unit": "ml"
        }
      ],
      "waiting": "Ngâm nếp 6–8 giờ trong ngăn mát",
      "equipment": [
        "Xửng hấp",
        "Nồi luộc",
        "Chảo nhỏ"
      ],
      "finish": "Hạt xôi bóng, tơi nhưng dẻo; thịt gà xé phủ trên, thêm hành phi và mỡ hành.",
      "steps": [
        {
          "title": "Ngâm và chuẩn bị nếp",
          "duration": "6–8 giờ",
          "heat": "Không dùng nhiệt",
          "detail": "Vo nếp, ngâm ngập nước trong ngăn mát. Đổ ra rổ để ráo 15 phút, trộn với hai phần ba muối. Không dùng nước ngâm để hấp.",
          "cue": "Hạt nếp nở đều, đã ráo bề mặt."
        },
        {
          "title": "Luộc gà",
          "duration": "25–30 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Cho đùi gà, gừng đập dập, muối còn lại và nước vào nồi. Đun sôi rồi hạ lửa; kiểm tra phần thịt dày không chạm xương đạt 74°C. Vớt ra, để nguội bớt rồi xé sợi.",
          "cue": "Gà chín kỹ, xé được sợi nhưng không vụn khô."
        },
        {
          "title": "Hấp xôi lượt đầu",
          "duration": "25 phút",
          "heat": "Lửa vừa",
          "detail": "Đun nước sôi trong xửng, rải nếp tơi, tạo vài lỗ thoát hơi. Đậy nắp có khăn hứng nước ngưng, tránh khăn chạm lửa. Hấp rồi đảo nhẹ từ dưới lên.",
          "cue": "Nếp chín gần hết, không có vùng khô cứng."
        },
        {
          "title": "Làm hành phi và mỡ hành",
          "duration": "8 phút",
          "heat": "Lửa nhỏ",
          "detail": "Thái hành tím mỏng, phi với dầu đến vàng nhạt rồi vớt ngay. Cho hành lá cắt nhỏ vào phần dầu nóng còn lại, tắt bếp.",
          "cue": "Hành phi vàng giòn, không nâu đen."
        },
        {
          "title": "Hấp hoàn tất",
          "duration": "10–15 phút",
          "heat": "Lửa vừa",
          "detail": "Rưới ít nước luộc gà nóng lên xôi nếu hạt còn khô, trộn nhẹ rồi hấp tiếp. Thử hạt ở giữa xửng; nếu còn lõi cứng, hấp thêm từng 5 phút.",
          "cue": "Hạt dẻo từ trong ra ngoài, không nhão."
        },
        {
          "title": "Bày xôi",
          "duration": "3 phút",
          "heat": "Tắt bếp",
          "detail": "Xới xôi ra đĩa, phủ gà xé, mỡ hành và hành phi. Dọn ngay khi nóng.",
          "cue": "Xôi thành ụ thấp, gà và hành phủ đều mặt."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-010",
    "prepTime": 12,
    "cookTime": 6,
    "cookingGuide": {
      "baseServings": 4,
      "measures": [
        {
          "ingredientId": "i-010-1",
          "name": "Rau muống",
          "quantity": 500,
          "unit": "g"
        },
        {
          "ingredientId": "i-010-2",
          "name": "Tỏi",
          "quantity": 20,
          "unit": "g"
        },
        {
          "ingredientId": "i-010-3",
          "name": "Dầu ăn",
          "quantity": 20,
          "unit": "ml"
        },
        {
          "ingredientId": "i-010-4",
          "name": "Nước mắm",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "ingredientId": "i-010-5",
          "name": "Đường",
          "quantity": 3,
          "unit": "g"
        },
        {
          "ingredientId": "i-010-6",
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "ingredientId": "i-010-7",
          "name": "Ớt tươi",
          "quantity": 1,
          "unit": "quả"
        }
      ],
      "pantry": [
        {
          "name": "Nước chần",
          "quantity": 1500,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi chần",
        "Chảo rộng"
      ],
      "finish": "Rau xanh bóng, cọng giòn, tỏi vàng nhạt nằm trên mặt.",
      "steps": [
        {
          "title": "Nhặt rau",
          "duration": "8 phút",
          "heat": "Chưa bật bếp",
          "detail": "Bỏ gốc già, ngắt rau đoạn 6–8 cm. Rửa nhiều lần bằng nước sạch, để ráo. Đập dập rồi băm thô tỏi; ớt cắt lát nếu dùng.",
          "cue": "Cọng non bẻ dễ, không còn đất cát."
        },
        {
          "title": "Pha gia vị",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Hòa nước mắm, đường và 2 thìa canh nước lấy từ lượng nước chần; để cạnh bếp. Muối dùng cho nồi chần.",
          "cue": "Đường tan, gia vị sẵn sàng để xào nhanh."
        },
        {
          "title": "Chần rau",
          "duration": "30–45 giây",
          "heat": "Lửa lớn",
          "detail": "Đun nước với muối thật sôi, cho rau vào, đảo cho ngập rồi vớt ngay. Xả nhanh nước mát sạch, để thật ráo.",
          "cue": "Rau vừa chuyển xanh đậm, cọng chưa mềm nhũn."
        },
        {
          "title": "Phi tỏi",
          "duration": "30 giây",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu trong chảo rộng, cho hai phần ba tỏi vào đảo đến thơm. Không chờ tỏi chuyển nâu.",
          "cue": "Tỏi vàng rất nhạt."
        },
        {
          "title": "Xào nhanh",
          "duration": "2–3 phút",
          "heat": "Lửa lớn",
          "detail": "Cho rau đã ráo vào đảo, thêm gia vị đã pha rồi tỏi còn lại. Xào theo mẻ nếu chảo nhỏ; dừng khi rau vừa nóng đều.",
          "cue": "Cọng còn độ giòn, đáy chảo ít nước."
        },
        {
          "title": "Bày rau",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Gắp rau ra đĩa ngay, rắc tỏi trong chảo và ớt lên trên. Không để rau nằm trong chảo nóng lâu.",
          "cue": "Rau xanh bóng, tỏi nổi trên mặt, không úa mềm."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-011",
    "prepTime": 10,
    "cookTime": 18,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-011-1",
          "name": "Đậu hũ",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-011-2",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-011-3",
          "name": "Dầu ăn",
          "quantity": 20,
          "unit": "ml"
        },
        {
          "ingredientId": "i-011-4",
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Đường",
          "quantity": 3,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 80,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo chống dính",
        "Xẻng lật"
      ],
      "finish": "Đậu vàng cạnh, phủ sốt cà chua đỏ cam, rắc hành xanh như ảnh.",
      "steps": [
        {
          "title": "Làm ráo đậu",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Thấm đậu bằng giấy bếp, cắt khối 2–3 cm. Để ráo trước khi chiên để hạn chế bắn dầu.",
          "cue": "Bề mặt đậu khô, miếng không vỡ."
        },
        {
          "title": "Chuẩn bị cà chua",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa cà chua, bỏ cuống, thái hạt lựu nhỏ. Rửa hành, tách đầu trắng và lá xanh rồi cắt nhỏ.",
          "cue": "Cà chua cắt nhỏ để nhanh mềm thành sốt."
        },
        {
          "title": "Chiên đậu",
          "duration": "8–10 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, xếp đậu một lớp. Đợi mặt dưới vàng mới trở, chiên các mặt rồi gắp ra đĩa.",
          "cue": "Vỏ vàng nhẹ, ruột vẫn mềm."
        },
        {
          "title": "Nấu sốt",
          "duration": "5–7 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Dùng dầu còn lại phi đầu hành, thêm cà chua và muối. Dằm nhẹ khi cà chua mềm; thêm nước và đường, đun đến sốt sánh.",
          "cue": "Cà chua nhuyễn phần lớn, sốt không khô cháy."
        },
        {
          "title": "Om đậu",
          "duration": "3 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho đậu vào, đảo hoặc lắc chảo nhẹ để sốt áo đều. Nếm rồi điều chỉnh muối từng ít; nếu đặc quá, thêm một chút nước.",
          "cue": "Sốt bám quanh đậu, không còn vũng nước loãng."
        },
        {
          "title": "Bày món",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc đậu ra đĩa nông, rưới sốt và rắc hành xanh. Xếp vài miếng có cạnh vàng lên trên.",
          "cue": "Đĩa có màu đỏ cam, vàng và xanh; đậu giữ hình khối."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-012",
    "prepTime": 5,
    "cookTime": 8,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-012-1",
          "name": "Trứng",
          "quantity": 4,
          "unit": "quả"
        },
        {
          "ingredientId": "i-012-2",
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-012-3",
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 1,
          "unit": "g"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo chống dính 22–24 cm",
        "Xẻng rộng"
      ],
      "finish": "Trứng thành miếng vàng đều, hành xanh phân bố trên mặt, giữa chín mềm.",
      "steps": [
        {
          "title": "Sơ chế hành",
          "duration": "2 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa hành, để ráo rồi thái thật nhỏ cả phần trắng và xanh. Chuẩn bị đĩa sạch để đặt trứng chín.",
          "cue": "Hành ráo, không làm hỗn hợp trứng loãng."
        },
        {
          "title": "Đánh trứng",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Đập từng quả vào bát nhỏ kiểm tra rồi cho vào bát lớn. Thêm muối, tiêu và hành, đánh đến lòng trắng hòa vào lòng đỏ.",
          "cue": "Hỗn hợp đều màu, không còn mảng lòng trắng dài."
        },
        {
          "title": "Làm nóng chảo",
          "duration": "1 phút",
          "heat": "Lửa vừa",
          "detail": "Cho dầu vào chảo, nghiêng cho phủ đáy; dầu nóng nhưng không bốc khói thì hạ lửa.",
          "cue": "Mặt chảo được phủ một lớp dầu mỏng."
        },
        {
          "title": "Chiên mặt đầu",
          "duration": "3–4 phút",
          "heat": "Lửa nhỏ vừa",
          "detail": "Đổ trứng, nghiêng chảo để lớp trứng đều. Đậy nắp 1–2 phút nếu mặt trên còn ướt; không tăng lửa để ép trứng chín nhanh.",
          "cue": "Mép trứng se, mặt dưới vàng nhạt."
        },
        {
          "title": "Trở và làm chín",
          "duration": "2–3 phút",
          "heat": "Lửa nhỏ",
          "detail": "Dùng xẻng rộng trở trứng, hoặc chia đôi rồi trở. Nấu đến giữa trứng đông hoàn toàn; món trứng đạt 71°C nếu đo bằng nhiệt kế.",
          "cue": "Không còn phần trứng lỏng, mặt ngoài không cháy."
        },
        {
          "title": "Bày đĩa",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Trượt trứng lên đĩa, mặt vàng và hành hướng lên. Cắt miếng hình quạt khi trứng đã đứng mặt.",
          "cue": "Miếng cắt gọn, bên trong vẫn mềm."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-013",
    "prepTime": 10,
    "cookTime": 15,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-013-1",
          "name": "Bí xanh",
          "quantity": 350,
          "unit": "g"
        },
        {
          "ingredientId": "i-013-2",
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-013-3",
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "ingredientId": "recipe-013-extra-1",
          "name": "Thịt heo băm",
          "quantity": 120,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 700,
          "unit": "ml"
        },
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi 1,5–2 lít",
        "Dao, thớt",
        "Muôi hớt bọt"
      ],
      "finish": "Bí xanh nhạt, hơi trong, thịt băm tơi và nước canh trong; hành xanh rắc trên mặt.",
      "steps": [
        {
          "title": "Gọt và cắt bí",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa bí, gọt vỏ, bỏ ruột xốp và hạt già. Cân lượng bí đã sơ chế theo danh sách; cắt lát dày khoảng 1 cm, miếng vừa thìa.",
          "cue": "Miếng bí đều độ dày để chín cùng lúc."
        },
        {
          "title": "Chuẩn bị thịt và hành",
          "duration": "3 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa hành, thái nhỏ, tách phần trắng và xanh. Trộn thịt băm với một phần tư muối và tiêu. Để thịt riêng, không dùng dụng cụ thịt sống cho món chín.",
          "cue": "Thịt tơi, hành cắt nhỏ; nguyên liệu được chia sẵn."
        },
        {
          "title": "Xào săn thịt",
          "duration": "2–3 phút",
          "heat": "Lửa vừa",
          "detail": "Cho dầu và đầu hành vào nồi, đảo khoảng 20 giây. Thêm thịt băm, dùng muôi tách nhỏ, đảo đến thịt săn; không ép thịt thành viên lớn.",
          "cue": "Thịt tơi thành hạt nhỏ, chưa cần cháy cạnh."
        },
        {
          "title": "Nấu nước canh",
          "duration": "4–5 phút",
          "heat": "Lửa vừa",
          "detail": "Thêm lượng nước đã định, đun đến sôi rồi hớt bọt. Hạ lửa để canh sôi nhẹ, tránh khuấy liên tục làm nước đục.",
          "cue": "Nước canh ít bọt và không sôi cuộn mạnh."
        },
        {
          "title": "Nấu bí và kiểm tra",
          "duration": "6–8 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Cho bí vào, nấu hé nắp. Thử miếng dày nhất: đầu đũa xuyên qua dễ nhưng miếng chưa nát. Thịt băm cần đạt 71°C; thời gian là ước lượng, tăng nếu miếng bí dày.",
          "cue": "Bí hơi trong ở mép, ruột mềm; thịt chín kỹ."
        },
        {
          "title": "Nêm và trình bày",
          "duration": "1–2 phút",
          "heat": "Tắt bếp",
          "detail": "Thêm muối còn lại từng ít, nếm vừa ăn rồi tắt. Rắc hành xanh, múc bí vào tô trước, chan nước và rải thịt lên mặt để nhìn rõ các thành phần.",
          "cue": "Canh trong, bí nguyên miếng, có thịt băm như ảnh; dùng nóng."
        }
      ]
    },
    "additions": [
      {
        "id": "recipe-013-extra-1",
        "name": "Thịt heo băm",
        "quantity": 120,
        "price": 140,
        "unit": "g",
        "store": "Bach Hoa Xanh",
        "category": "Đạm",
        "image": "/images/catalog/i-015-1.svg"
      }
    ]
  },
  {
    "id": "recipe-014",
    "prepTime": 10,
    "cookTime": 5,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-014-1",
          "name": "Rau cải",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-014-2",
          "name": "Tỏi",
          "quantity": 10,
          "unit": "g"
        },
        {
          "ingredientId": "i-014-3",
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 30,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo rộng"
      ],
      "finish": "Rau cải xanh bóng, thân vừa mềm và tỏi vàng nhạt, không ngập nước.",
      "steps": [
        {
          "title": "Rửa rau",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cắt bỏ gốc, tách bẹ rau và rửa kỹ kẽ lá. Để ráo; cắt thân dài 4–5 cm, để thân và lá riêng.",
          "cue": "Không còn đất ở gốc bẹ, rau ráo nước."
        },
        {
          "title": "Chuẩn bị tỏi",
          "duration": "2 phút",
          "heat": "Chưa bật bếp",
          "detail": "Bóc tỏi, đập dập và băm thô. Chuẩn bị sẵn muối và nước vì lúc xào cần thao tác nhanh.",
          "cue": "Tỏi không băm quá nhuyễn dễ cháy."
        },
        {
          "title": "Phi tỏi",
          "duration": "30 giây",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, cho tỏi vào đảo đến thơm rồi tăng lửa.",
          "cue": "Tỏi mới vàng nhạt, không nâu."
        },
        {
          "title": "Xào phần thân",
          "duration": "2 phút",
          "heat": "Lửa lớn",
          "detail": "Cho thân cải vào trước, đảo đều, thêm nước để tạo hơi; chỉ đậy nắp khoảng 30 giây nếu thân dày.",
          "cue": "Thân chuyển hơi trong nhưng còn độ giòn."
        },
        {
          "title": "Thêm lá và nêm",
          "duration": "1–2 phút",
          "heat": "Lửa lớn",
          "detail": "Thêm lá, rắc muối, đảo đến lá vừa xẹp. Nếm một miếng, điều chỉnh muối; không tiếp tục nấu đến lá thâm.",
          "cue": "Rau xanh, đáy chảo chỉ còn ít nước."
        },
        {
          "title": "Dọn ngay",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Gắp rau ra đĩa, rưới chút nước xào và tỏi lên mặt. Không để trong chảo nóng.",
          "cue": "Thân và lá còn hình dạng, không mềm nhũn."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-015",
    "prepTime": 5,
    "cookTime": 12,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-015-1",
          "name": "Thịt heo băm",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-015-2",
          "name": "Hành tím",
          "quantity": 15,
          "unit": "g"
        },
        {
          "ingredientId": "i-015-3",
          "name": "Nước mắm",
          "quantity": 10,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo chống dính",
        "Muôi gỗ"
      ],
      "finish": "Thịt băm tơi, màu nâu vàng, hành mềm, không còn nhiều nước dưới đĩa.",
      "steps": [
        {
          "title": "Chuẩn bị",
          "duration": "3 phút",
          "heat": "Chưa bật bếp",
          "detail": "Băm nhỏ hành tím. Hòa nước mắm, đường và nước trong bát; thịt băm giữ lạnh đến trước lúc nấu.",
          "cue": "Đường tan, sốt nêm đã sẵn."
        },
        {
          "title": "Phi hành",
          "duration": "1 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, cho hành vào đảo đến thơm và trong nhẹ.",
          "cue": "Hành chưa nâu đen."
        },
        {
          "title": "Làm tơi thịt",
          "duration": "3–4 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho thịt vào chảo, dùng muôi tách nhỏ liên tục. Đảo đến không còn cục thịt lớn và nước tiết ra bắt đầu cạn.",
          "cue": "Hạt thịt nhỏ, tơi, không đóng bánh."
        },
        {
          "title": "Rang và nêm",
          "duration": "4–5 phút",
          "heat": "Lửa vừa",
          "detail": "Rưới sốt nêm quanh chảo, đảo đều. Khi nước cạn, hạ lửa và đảo thêm cho cạnh thịt vàng nhẹ; đo thịt đạt 71°C.",
          "cue": "Thịt chín kỹ, nâu vàng nhẹ, không khô cháy."
        },
        {
          "title": "Điều chỉnh",
          "duration": "1 phút",
          "heat": "Lửa nhỏ",
          "detail": "Nếm một ít thịt đã chín. Nếu mặn, thêm một chút nước rồi đảo; nếu khô, thêm vài thìa cà phê nước. Rắc tiêu.",
          "cue": "Thịt đủ ẩm để ăn với cơm, không thành vụn cứng."
        },
        {
          "title": "Bày đĩa",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc thịt thành ụ thấp, rải hành từ chảo lên trên. Dùng cùng cơm và rau riêng.",
          "cue": "Nhìn rõ hạt thịt rang, không ngập sốt."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-016",
    "prepTime": 7,
    "cookTime": 10,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-016-1",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-016-2",
          "name": "Trứng",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-016-3",
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 650,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi nhỏ",
        "Bát đánh trứng"
      ],
      "finish": "Nước canh đỏ nhạt, cà chua mềm còn múi, trứng thành vân mảnh và hành xanh.",
      "steps": [
        {
          "title": "Sơ chế",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa cà chua, bỏ cuống, bổ múi nhỏ. Rửa và thái hành; để đầu trắng riêng. Đập trứng vào bát, đánh tan.",
          "cue": "Trứng hòa đều, cà chua cắt miếng vừa thìa."
        },
        {
          "title": "Xào cà chua",
          "duration": "3 phút",
          "heat": "Lửa vừa",
          "detail": "Phi đầu hành với dầu, cho cà chua và nửa muối vào đảo. Dằm nhẹ một phần cà chua để tạo màu nước canh.",
          "cue": "Cà chua mềm cạnh, có nước đỏ dưới đáy nồi."
        },
        {
          "title": "Nấu nước",
          "duration": "4 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Thêm nước, đun sôi rồi hạ về sôi nhẹ. Nêm phần muối còn lại từng ít, nếm vừa.",
          "cue": "Nước đỏ nhạt, còn vài múi cà chua nguyên."
        },
        {
          "title": "Tạo vân trứng",
          "duration": "1–2 phút",
          "heat": "Lửa nhỏ vừa",
          "detail": "Rót trứng thành dòng mảnh theo vòng tròn. Đợi 10–15 giây cho se rồi khuấy nhẹ một chiều, không khuấy mạnh liên tục.",
          "cue": "Trứng thành sợi hoặc vân, không vón thành khối lớn."
        },
        {
          "title": "Làm chín",
          "duration": "1–2 phút",
          "heat": "Lửa nhỏ",
          "detail": "Đun sôi nhẹ đến trứng đông hoàn toàn; món trứng đạt 71°C nếu đo. Không để canh sôi cuộn làm vỡ hết vân trứng.",
          "cue": "Trứng chín, không còn lòng trắng trong."
        },
        {
          "title": "Múc canh",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Rắc hành xanh, múc nhẹ vào tô để giữ vân trứng, đặt vài múi cà chua trên mặt.",
          "cue": "Tô có vân trứng vàng nhạt xen cà chua đỏ."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-017",
    "prepTime": 15,
    "cookTime": 30,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-017-1",
          "name": "Cá basa",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-017-2",
          "name": "Tiêu",
          "quantity": 1,
          "unit": "g"
        },
        {
          "ingredientId": "i-017-3",
          "name": "Nước mắm",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Đường",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Hành tím",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Nước",
          "quantity": 200,
          "unit": "ml"
        },
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Ướp cá 15 phút trong ngăn mát",
      "equipment": [
        "Nồi đáy dày hoặc nồi đất dùng được trên bếp"
      ],
      "finish": "Khoanh cá nguyên, nước kho nâu sánh bám mặt; tiêu và hành nổi rõ.",
      "steps": [
        {
          "title": "Chuẩn bị cá",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Dùng cá đã làm sạch, cắt khoanh dày 2–3 cm, thấm ráo. Băm hành tím, cắt nhỏ hành lá.",
          "cue": "Khoanh cá đều cỡ, không còn máu đọng."
        },
        {
          "title": "Ướp",
          "duration": "15 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Trộn cá với nước mắm, nửa tiêu, nửa đường và hành tím; đậy kín trong ngăn mát. Trở nhẹ để gia vị phủ hai mặt.",
          "cue": "Cá ngấm đều, khoanh không bị nát."
        },
        {
          "title": "Tạo nước màu",
          "duration": "3 phút",
          "heat": "Lửa nhỏ",
          "detail": "Đun đường còn lại với ít nước đến hổ phách; thêm nước còn lại từ từ. Nếu đường đen hoặc đắng, làm lại; cho dầu vào khi nước màu đã nguội bớt.",
          "cue": "Nước màu nâu trong, không mùi cháy."
        },
        {
          "title": "Kho cá",
          "duration": "20–25 phút",
          "heat": "Lửa nhỏ",
          "detail": "Xếp cá một lớp vào nồi nước màu, thêm cả nước ướp. Đun sôi rồi hạ lửa, hé nắp. Thỉnh thoảng nghiêng nồi, dùng thìa rưới nước lên cá thay vì đảo.",
          "cue": "Cá chín đạt 63°C, thịt chắc nhưng không khô."
        },
        {
          "title": "Làm sánh",
          "duration": "3–5 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Mở nắp cho nước rút còn vài thìa quanh cá. Nếm và điều chỉnh bằng chút nước nếu quá mặn; rắc tiêu còn lại.",
          "cue": "Sốt bám lưng thìa, không cạn cháy đáy nồi."
        },
        {
          "title": "Trình bày",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Đặt khoanh cá ra đĩa hoặc giữ trong nồi đất, rưới sốt và rắc hành. Gắp nhẹ để khoanh nguyên.",
          "cue": "Cá bóng nâu, tiêu và hành trên mặt; chú ý xương khi ăn."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-018",
    "prepTime": 12,
    "cookTime": 30,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-018-1",
          "name": "Thịt gà",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-018-2",
          "name": "Gừng",
          "quantity": 25,
          "unit": "g"
        },
        {
          "ingredientId": "i-018-3",
          "name": "Nước mắm",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Đường",
          "quantity": 8,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Hành tím",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 180,
          "unit": "ml"
        },
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Ướp gà 15 phút trong ngăn mát",
      "equipment": [
        "Nồi hoặc chảo sâu lòng",
        "Nhiệt kế"
      ],
      "finish": "Gà nâu óng, gừng thái sợi nằm trên thịt, nước kho sánh nhẹ.",
      "steps": [
        {
          "title": "Cắt gà và gừng",
          "duration": "7 phút",
          "heat": "Chưa bật bếp",
          "detail": "Dùng gà đã sơ chế, thấm khô, cắt miếng 3–4 cm. Gừng rửa sạch, thái sợi; hành tím băm, hành lá cắt nhỏ. Không rửa gà dưới vòi nước để tránh bắn nước thịt sống.",
          "cue": "Miếng gà đều, dụng cụ sống tách riêng."
        },
        {
          "title": "Ướp gà",
          "duration": "15 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Trộn gà với nước mắm, đường, nửa gừng và nửa hành tím; đậy kín để ngăn mát.",
          "cue": "Gia vị phủ đều từng miếng."
        },
        {
          "title": "Xào săn",
          "duration": "5 phút",
          "heat": "Lửa vừa",
          "detail": "Phi hành tím còn lại với dầu, thêm gừng còn lại, đảo thơm. Cho gà và nước ướp vào, trở các mặt đến săn.",
          "cue": "Mặt gà đổi màu và bắt đầu óng nâu."
        },
        {
          "title": "Kho mềm",
          "duration": "20–25 phút",
          "heat": "Lửa nhỏ",
          "detail": "Thêm nước, đun sôi rồi hạ lửa, đậy hé. Trở vài lần; thêm nước nóng nếu cạn sớm. Kiểm tra phần dày của gà, tránh xương, đạt 74°C.",
          "cue": "Gà chín kỹ, miếng nguyên, gừng mềm."
        },
        {
          "title": "Cô sốt",
          "duration": "3 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Mở nắp, đảo nhẹ cho nước rút và áo quanh gà. Nếm nước kho, thêm nước nếu quá đậm.",
          "cue": "Sốt còn ở đáy, không cháy hoặc khô đặc."
        },
        {
          "title": "Dọn món",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc gà vào tô, gắp gừng lên trên và rắc hành lá. Rưới sốt quanh miếng gà.",
          "cue": "Gà và sợi gừng nổi rõ, mặt bóng nhẹ."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-019",
    "prepTime": 12,
    "cookTime": 18,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-019-1",
          "name": "Cá diêu hồng",
          "quantity": 350,
          "unit": "g"
        },
        {
          "ingredientId": "i-019-2",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-019-3",
          "name": "Dứa",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-019-4",
          "name": "Me",
          "quantity": 20,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 800,
          "unit": "ml"
        },
        {
          "name": "Nước mắm",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 8,
          "unit": "g"
        },
        {
          "name": "Rau om",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi nhỏ",
        "Rây lọc me"
      ],
      "finish": "Cá nguyên miếng, canh chua thanh, cà chua đỏ và dứa vàng trong nước canh.",
      "steps": [
        {
          "title": "Sơ chế",
          "duration": "6 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cá làm sạch cắt khúc 2–3 cm, thấm ráo. Cà chua bổ múi, dứa bỏ mắt cắt lát mỏng, rau om rửa và cắt nhỏ.",
          "cue": "Rau và cá được chuẩn bị bằng dụng cụ riêng."
        },
        {
          "title": "Lọc me",
          "duration": "3 phút",
          "heat": "Nước nóng",
          "detail": "Dầm me trong ít nước nóng lấy từ lượng nước đã định; lọc lấy nước, bỏ hạt và xơ.",
          "cue": "Nước me không lẫn hạt."
        },
        {
          "title": "Nấu cá",
          "duration": "8–12 phút",
          "heat": "Lửa vừa",
          "detail": "Đun phần nước còn lại với dứa, thêm cá khi sôi. Hớt bọt, nấu sôi nhẹ và không đảo mạnh. Đo cá đạt 63°C ở chỗ dày nhất.",
          "cue": "Thịt cá chuyển đục, miếng cá không vỡ."
        },
        {
          "title": "Nêm chua ngọt",
          "duration": "4 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Cho cà chua, đường, nước mắm và nửa nước me. Nếm rồi thêm nước me từng chút đến chua dịu.",
          "cue": "Cà chua mềm nhưng còn múi, canh không gắt chua."
        },
        {
          "title": "Thêm rau thơm",
          "duration": "30 giây",
          "heat": "Tắt bếp",
          "detail": "Rắc rau om sau khi tắt bếp, đảo nhẹ một lần. Nếm lại và thêm một chút nước nóng nếu vị quá đậm.",
          "cue": "Rau giữ màu xanh và mùi thơm."
        },
        {
          "title": "Bày canh",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Đặt cá giữa tô, xếp cà chua và dứa quanh, chan nước vừa ngập.",
          "cue": "Thấy rõ cá và rau trên mặt; lưu ý xương khi ăn."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-020",
    "prepTime": 15,
    "cookTime": 55,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-020-1",
          "name": "Thịt heo",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-020-2",
          "name": "Trứng",
          "quantity": 3,
          "unit": "quả"
        },
        {
          "ingredientId": "i-020-3",
          "name": "Nước mắm",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Đường",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Hành tím",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 400,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Ướp thịt 15 phút trong ngăn mát",
      "equipment": [
        "Nồi đáy dày",
        "Nồi luộc trứng"
      ],
      "finish": "Thịt nâu mềm, trứng nguyên vàng nhẹ, nước kho còn xâm xấp.",
      "steps": [
        {
          "title": "Ướp thịt",
          "duration": "15 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Thấm khô thịt, cắt khối 2–3 cm, băm hành tím. Trộn thịt với hành, nước mắm, tiêu và nửa đường; để ngăn mát.",
          "cue": "Miếng thịt đều, gia vị bám quanh."
        },
        {
          "title": "Luộc trứng",
          "duration": "10–12 phút",
          "heat": "Lửa vừa",
          "detail": "Luộc trứng 10–12 phút tính từ lúc sôi nhẹ. Làm nguội, bóc vỏ, để nguyên quả.",
          "cue": "Trứng không vỡ, vỏ được bóc sạch."
        },
        {
          "title": "Tạo màu và săn thịt",
          "duration": "5 phút",
          "heat": "Lửa nhỏ rồi vừa",
          "detail": "Đun đường còn lại với một ít nước đến hổ phách, thêm nước cẩn thận. Cho thịt vào đảo săn, tránh làm đường cháy.",
          "cue": "Thịt có lớp màu nâu nhẹ."
        },
        {
          "title": "Kho thịt",
          "duration": "35–45 phút",
          "heat": "Lửa nhỏ",
          "detail": "Thêm nước còn lại, đun sôi rồi hạ lửa và hé nắp. Hớt bọt, trở nhẹ; thêm nước nóng khi cạn sớm. Thịt phải đạt ít nhất 63°C và nghỉ 3 phút trước khi ăn.",
          "cue": "Thịt xiên dễ, miếng chưa nát."
        },
        {
          "title": "Kho cùng trứng",
          "duration": "10 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho trứng vào nồi, trở vài lần để thấm màu. Nêm lại nước kho, giữ còn xâm xấp để trứng không khô.",
          "cue": "Trứng vàng nhạt, nước kho dịu và sánh nhẹ."
        },
        {
          "title": "Bày tô",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc thịt và trứng xen kẽ, rưới nước kho. Có thể bổ đôi một quả để thấy lòng đỏ trước khi dọn.",
          "cue": "Tô có cả thịt và trứng, dùng cùng cơm riêng."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-021",
    "prepTime": 10,
    "cookTime": 10,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-021-1",
          "name": "Cơm nguội",
          "quantity": 400,
          "unit": "g"
        },
        {
          "ingredientId": "i-021-2",
          "name": "Cà rốt",
          "quantity": 80,
          "unit": "g"
        },
        {
          "ingredientId": "i-021-3",
          "name": "Đậu Hà Lan",
          "quantity": 80,
          "unit": "g"
        },
        {
          "ingredientId": "i-021-4",
          "name": "Dầu ăn",
          "quantity": 15,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Dùng cơm đã bảo quản lạnh đúng cách",
      "equipment": [
        "Chảo rộng",
        "Muôi đảo"
      ],
      "finish": "Hạt cơm tơi, xen cà rốt cam và đậu xanh, không bết hoặc đọng dầu.",
      "steps": [
        {
          "title": "Chuẩn bị cơm",
          "duration": "3 phút",
          "heat": "Chưa bật bếp",
          "detail": "Dùng cơm nguội được cho vào tủ lạnh trong vòng 2 giờ sau nấu, giữ lạnh đến lúc dùng. Dùng muôi tách nhẹ các cục cơm. Không dùng cơm để ngoài qua đêm.",
          "cue": "Hạt cơm tách rời, không có cục lớn."
        },
        {
          "title": "Cắt rau",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cà rốt gọt vỏ, thái hạt lựu nhỏ khoảng 5 mm. Rửa đậu và hành; nếu đậu đông lạnh, rã theo hướng dẫn bao bì rồi để ráo.",
          "cue": "Rau cắt nhỏ và ráo nước."
        },
        {
          "title": "Xào rau",
          "duration": "3–4 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, cho cà rốt vào trước, đảo 2 phút rồi thêm đậu. Đảo đến rau gần chín.",
          "cue": "Cà rốt hơi mềm, đậu xanh, không cháy cạnh."
        },
        {
          "title": "Chiên cơm",
          "duration": "4–5 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho cơm vào, dùng mặt muôi ép nhẹ cho tơi rồi đảo liên tục. Chia mẻ nếu chảo chật; không thêm nhiều nước.",
          "cue": "Cơm và rau trộn đều, hạt tơi."
        },
        {
          "title": "Nêm và làm nóng kỹ",
          "duration": "2 phút",
          "heat": "Lửa vừa",
          "detail": "Rắc muối, đảo đều; kiểm tra cơm đạt 74°C ở giữa phần cơm. Thêm hành cuối cùng, nếm điều chỉnh.",
          "cue": "Cơm nóng đều, không còn chỗ lạnh."
        },
        {
          "title": "Dọn",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc cơm thành ụ thấp trên đĩa, rải vài hạt đậu và cà rốt trên mặt. Ăn ngay khi nóng.",
          "cue": "Màu rau phân bố đều, không có vũng dầu."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-022",
    "prepTime": 8,
    "cookTime": 8,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-022-1",
          "name": "Mướp",
          "quantity": 350,
          "unit": "g"
        },
        {
          "ingredientId": "i-022-2",
          "name": "Trứng",
          "quantity": 3,
          "unit": "quả"
        },
        {
          "ingredientId": "i-022-3",
          "name": "Dầu ăn",
          "quantity": 15,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Tỏi",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo chống dính"
      ],
      "finish": "Mướp xanh nhạt, trứng vàng mềm thành miếng, ít nước xào.",
      "steps": [
        {
          "title": "Sơ chế mướp",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Gọt lớp vỏ cứng, rửa mướp rồi cắt vát dày khoảng 1 cm. Nếu mướp có vị đắng bất thường, không dùng. Băm tỏi.",
          "cue": "Miếng đều, không quá mỏng dễ nát."
        },
        {
          "title": "Đánh trứng",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Đánh trứng với một phần ba muối đến lòng trắng và đỏ hòa đều.",
          "cue": "Hỗn hợp vàng đồng nhất."
        },
        {
          "title": "Chiên trứng",
          "duration": "2 phút",
          "heat": "Lửa vừa",
          "detail": "Dùng nửa dầu làm nóng chảo, đổ trứng; khi bắt đầu se, đẩy nhẹ thành miếng lớn rồi lấy ra.",
          "cue": "Trứng vừa đông, còn mềm, chưa chiên khô."
        },
        {
          "title": "Xào mướp",
          "duration": "3–4 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Thêm dầu còn lại, phi tỏi rồi cho mướp. Đảo, thêm muối và nước nếu chảo khô; không thêm nhiều vì mướp tự ra nước.",
          "cue": "Mướp hơi trong ở mép, ruột mềm vừa."
        },
        {
          "title": "Trộn trứng",
          "duration": "1–2 phút",
          "heat": "Lửa vừa",
          "detail": "Cho trứng trở lại, đảo nhẹ để miếng không vụn. Nấu đến trứng chín hoàn toàn, đạt 71°C nếu đo.",
          "cue": "Mướp nguyên miếng, trứng không còn ướt sống."
        },
        {
          "title": "Bày món",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc ra đĩa nông, để miếng trứng nằm xen giữa mướp. Rưới vừa đủ nước xào.",
          "cue": "Đĩa thấy rõ màu xanh nhạt và vàng."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-023",
    "prepTime": 10,
    "cookTime": 12,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-023-1",
          "name": "Rau ngót",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-023-2",
          "name": "Thịt heo băm",
          "quantity": 150,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Hành tím",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 700,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi nhỏ"
      ],
      "finish": "Rau ngót xanh sẫm vừa mềm, thịt băm tơi, nước canh trong.",
      "steps": [
        {
          "title": "Nhặt rau",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Tuốt lá, bỏ cọng cứng và lá úa. Rửa sạch, để ráo rồi vò nhẹ lá trong tay sạch để lá mềm hơn, không vò nát.",
          "cue": "Lá nguyên phần lớn, không còn cọng già."
        },
        {
          "title": "Chuẩn bị thịt",
          "duration": "2 phút",
          "heat": "Chưa bật bếp",
          "detail": "Băm hành tím. Trộn thịt với một phần ba muối; giữ thịt và dụng cụ riêng khỏi rau đã rửa.",
          "cue": "Thịt tơi, không đóng khối."
        },
        {
          "title": "Xào thịt",
          "duration": "3 phút",
          "heat": "Lửa vừa",
          "detail": "Phi hành với dầu, cho thịt vào, dùng muôi tách nhỏ và đảo săn.",
          "cue": "Thịt thành hạt nhỏ đều."
        },
        {
          "title": "Nấu nước canh",
          "duration": "4 phút",
          "heat": "Lửa vừa",
          "detail": "Thêm nước, đun sôi rồi hớt bọt. Hạ lửa, kiểm tra thịt băm đạt 71°C.",
          "cue": "Nước ít bọt, thịt chín kỹ."
        },
        {
          "title": "Nấu rau",
          "duration": "3–5 phút",
          "heat": "Lửa vừa",
          "detail": "Cho rau vào, đảo cho ngập. Nêm muối còn lại từng ít, nấu đến lá mềm vừa; không đun lâu đến vàng úa.",
          "cue": "Rau xanh sẫm, lá mềm nhưng còn hình."
        },
        {
          "title": "Múc canh",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc rau và nước vào tô, rải thịt lên mặt để không chìm hết dưới đáy.",
          "cue": "Canh có rau và thịt rõ, dùng nóng."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-024",
    "prepTime": 10,
    "cookTime": 15,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-024-1",
          "name": "Đậu hũ",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-024-2",
          "name": "Sả",
          "quantity": 2,
          "unit": "nhánh"
        },
        {
          "ingredientId": "i-024-3",
          "name": "Dầu ăn",
          "quantity": 25,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Ớt tươi (tùy chọn)",
          "quantity": 0.5,
          "unit": "quả"
        }
      ],
      "waiting": "Thấm đậu ráo trước khi chiên",
      "equipment": [
        "Chảo chống dính",
        "Giấy thấm dầu"
      ],
      "finish": "Đậu vàng giòn, sả băm bám ngoài thành lớp vụn vàng, không cháy đen.",
      "steps": [
        {
          "title": "Làm ráo đậu",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Thấm đậu bằng giấy bếp rồi cắt khối 2–3 cm. Để ra đĩa khô, không xếp chồng khi còn ướt.",
          "cue": "Bề mặt khô, miếng nguyên."
        },
        {
          "title": "Băm sả",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Bỏ lá già và gốc sả, chỉ dùng phần lõi trắng mềm. Thái rất mỏng rồi băm nhỏ; ớt bỏ hạt và băm nếu dùng.",
          "cue": "Sả mịn, không còn sợi dài cứng."
        },
        {
          "title": "Chiên đậu",
          "duration": "8–10 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, chiên đậu một lớp. Đợi mặt dưới vàng rồi trở, chiên vàng các mặt và gắp ra.",
          "cue": "Vỏ vàng đều, không nát."
        },
        {
          "title": "Phi sả",
          "duration": "1–2 phút",
          "heat": "Lửa nhỏ",
          "detail": "Chừa một lớp dầu mỏng trong chảo, cho sả vào đảo liên tục. Khi sả thơm vàng nhạt, thêm muối và ớt.",
          "cue": "Sả tơi thơm, chưa chuyển nâu."
        },
        {
          "title": "Áo sả lên đậu",
          "duration": "1 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cho đậu trở lại, lắc chảo hoặc đảo nhẹ cho sả bám. Tắt bếp ngay khi sả đã phủ đều.",
          "cue": "Đậu được phủ lớp sả mỏng, không cháy vụn."
        },
        {
          "title": "Bày đĩa",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Xếp đậu thành lớp, rắc sả còn lại trong chảo lên mặt; dùng nóng để giữ độ giòn.",
          "cue": "Đậu vàng rõ và sả nằm trên bề mặt."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-025",
    "prepTime": 10,
    "cookTime": 6,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-025-1",
          "name": "Bắp cải",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-025-2",
          "name": "Cà rốt",
          "quantity": 80,
          "unit": "g"
        },
        {
          "ingredientId": "i-025-3",
          "name": "Tỏi",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 20,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo rộng"
      ],
      "finish": "Bắp cải xanh nhạt, cà rốt cam thái sợi, vừa giòn và không chảy nhiều nước.",
      "steps": [
        {
          "title": "Cắt bắp cải",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Bỏ lá ngoài hỏng và lõi cứng, rửa rồi để ráo. Thái bắp cải thành sợi rộng khoảng 1 cm.",
          "cue": "Sợi đều, ráo nước."
        },
        {
          "title": "Chuẩn bị cà rốt và tỏi",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Gọt cà rốt, thái sợi mỏng; bóc tỏi và băm thô. Chuẩn bị sẵn muối và nước.",
          "cue": "Cà rốt mỏng để chín cùng bắp cải."
        },
        {
          "title": "Phi tỏi",
          "duration": "30 giây",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, cho tỏi vào đảo đến thơm.",
          "cue": "Tỏi vàng nhạt, không cháy."
        },
        {
          "title": "Xào cà rốt",
          "duration": "2 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho cà rốt vào đảo trước, thêm nước nếu đáy chảo khô. Đảo đến cà rốt hơi mềm.",
          "cue": "Sợi cà rốt còn nguyên, không sống cứng."
        },
        {
          "title": "Xào bắp cải",
          "duration": "2–3 phút",
          "heat": "Lửa lớn",
          "detail": "Thêm bắp cải và muối, đảo từ dưới lên cho chín đều. Không đậy nắp lâu; nếm và tắt khi rau vừa mềm.",
          "cue": "Bắp cải còn giòn nhẹ, không thâm và không ngập nước."
        },
        {
          "title": "Bày món",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc rau ra ngay, xếp thành ụ thấp để hơi thoát. Để cà rốt xen đều trên mặt.",
          "cue": "Màu xanh nhạt và cam rõ, rau không nát."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-026",
    "prepTime": 12,
    "cookTime": 10,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-026-1",
          "name": "Tôm",
          "quantity": 300,
          "unit": "g"
        },
        {
          "ingredientId": "i-026-2",
          "name": "Hành tím",
          "quantity": 15,
          "unit": "g"
        },
        {
          "ingredientId": "i-026-3",
          "name": "Nước mắm",
          "quantity": 15,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Đường",
          "quantity": 10,
          "unit": "g"
        },
        {
          "name": "Dầu ăn",
          "quantity": 10,
          "unit": "ml"
        },
        {
          "name": "Nước",
          "quantity": 40,
          "unit": "ml"
        },
        {
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Chảo rộng"
      ],
      "finish": "Tôm đỏ cam, còn nguyên vỏ, sốt mặn ngọt bóng bám thân.",
      "steps": [
        {
          "title": "Làm sạch tôm",
          "duration": "7 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cắt râu và mũi nhọn, rạch nhẹ lưng bỏ chỉ. Rửa nhanh bằng nước sạch rồi thấm ráo. Giữ vỏ để giống ảnh; có thể bỏ đầu nếu thích.",
          "cue": "Tôm sạch chỉ lưng và khô bề mặt."
        },
        {
          "title": "Pha sốt",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Hòa nước mắm, đường và nước; băm hành tím, cắt hành lá.",
          "cue": "Đường tan, sốt sẵn bên bếp."
        },
        {
          "title": "Phi hành",
          "duration": "1 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, phi hành tím đến thơm và vàng nhạt.",
          "cue": "Hành chưa nâu đen."
        },
        {
          "title": "Đảo tôm",
          "duration": "3–4 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho tôm vào một lớp, đảo và trở để chuyển đỏ đều. Nếu nhiều tôm, chia mẻ.",
          "cue": "Vỏ đỏ cam, thịt bắt đầu trắng đục."
        },
        {
          "title": "Rim sốt",
          "duration": "3–5 phút",
          "heat": "Lửa vừa nhỏ",
          "detail": "Đổ sốt vào, trở tôm cho áo đều. Nấu đến phần thịt dày đạt 63°C; cho sốt sánh vừa, không rim cạn cháy.",
          "cue": "Sốt bám bóng thân tôm, thịt chín và còn mọng."
        },
        {
          "title": "Bày tôm",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Xếp tôm cong cùng chiều trên đĩa, rưới sốt và rắc hành lá. Dùng khi nóng.",
          "cue": "Màu đỏ cam nổi bật, không có vũng dầu lớn."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-027",
    "prepTime": 8,
    "cookTime": 25,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-027-1",
          "name": "Trứng",
          "quantity": 3,
          "unit": "quả"
        },
        {
          "ingredientId": "i-027-2",
          "name": "Thịt heo băm",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-027-3",
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Nước",
          "quantity": 90,
          "unit": "ml"
        },
        {
          "name": "Nước mắm",
          "quantity": 8,
          "unit": "ml"
        },
        {
          "name": "Dầu ăn",
          "quantity": 5,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Xửng hấp",
        "Bát chịu nhiệt nông",
        "Nhiệt kế"
      ],
      "finish": "Trứng mềm đông đều, thịt băm phân bố bên trong, mặt có hành xanh.",
      "steps": [
        {
          "title": "Chuẩn bị xửng",
          "duration": "3 phút",
          "heat": "Lửa lớn",
          "detail": "Cho nước vào đáy xửng, mức nước không chạm bát. Đun sôi; quét dầu mỏng vào bát chịu nhiệt sâu khoảng 3–4 cm.",
          "cue": "Xửng có hơi, bát đứng vững."
        },
        {
          "title": "Trộn thịt",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Trộn thịt băm với nước mắm và tiêu, dùng đũa tách thịt cho tơi. Rửa hành, thái nhỏ.",
          "cue": "Thịt không thành cục lớn."
        },
        {
          "title": "Đánh trứng",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Đánh tan trứng với lượng nước đã định, trộn cùng thịt và phần lớn hành. Hớt bọt trên mặt, đổ vào bát.",
          "cue": "Hỗn hợp đều, lớp trứng không quá dày."
        },
        {
          "title": "Hấp",
          "duration": "20–25 phút",
          "heat": "Lửa nhỏ vừa",
          "detail": "Đặt bát vào xửng, đậy bát bằng đĩa nhỏ hoặc giấy bạc có khe thoát hơi để nước không nhỏ vào. Hấp sôi nhẹ; không mở nắp liên tục.",
          "cue": "Mặt trứng đông dần, không phồng rỗ mạnh."
        },
        {
          "title": "Kiểm tra giữa bát",
          "duration": "2–5 phút",
          "heat": "Lửa nhỏ",
          "detail": "Cắm nhiệt kế vào giữa món, đạt 71°C. Nếu còn lỏng, hấp thêm từng 3 phút. Với nhiều khẩu phần, chia bát nông thay vì dùng một bát rất dày.",
          "cue": "Giữa bát đông, thịt chín kỹ, không có nước trứng sống."
        },
        {
          "title": "Dọn",
          "duration": "2 phút",
          "heat": "Tắt bếp",
          "detail": "Để bát nghỉ 2 phút, rắc hành còn lại. Dùng thìa sạch xắn miếng để thấy phần trứng và thịt.",
          "cue": "Trứng giữ miếng nhưng mềm, ăn nóng."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-028",
    "prepTime": 8,
    "cookTime": 10,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-028-1",
          "name": "Nấm",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-028-2",
          "name": "Đậu hũ",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-028-3",
          "name": "Hành lá",
          "quantity": 10,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Muối",
          "quantity": 2,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 700,
          "unit": "ml"
        },
        {
          "name": "Tiêu",
          "quantity": 0.5,
          "unit": "g"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi nhỏ"
      ],
      "finish": "Canh trong, đậu trắng nguyên khối, nấm chín mềm và hành xanh.",
      "steps": [
        {
          "title": "Sơ chế nấm",
          "duration": "4 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cắt bỏ gốc nấm, rửa nhanh, để ráo. Nấm lớn thái lát 5 mm hoặc xé miếng vừa ăn.",
          "cue": "Nấm sạch, không ngâm lâu làm nhũn."
        },
        {
          "title": "Cắt đậu và hành",
          "duration": "3 phút",
          "heat": "Chưa bật bếp",
          "detail": "Cắt đậu thành khối 2 cm. Rửa hành, thái nhỏ; đậu để riêng để không vỡ khi trộn.",
          "cue": "Khối đậu đều và nguyên."
        },
        {
          "title": "Nấu nấm",
          "duration": "4–5 phút",
          "heat": "Lửa vừa",
          "detail": "Đun nước sôi, cho nấm vào, hạ lửa và nấu đến nấm mềm. Hớt bọt nếu có.",
          "cue": "Nấm chín, nước canh ít bọt."
        },
        {
          "title": "Thêm đậu",
          "duration": "3–4 phút",
          "heat": "Lửa nhỏ vừa",
          "detail": "Thả đậu sát mặt nước để tránh bắn. Chỉ lắc nồi nhẹ, không khuấy mạnh. Thêm muối từng ít và nếm.",
          "cue": "Đậu nóng tới giữa, nước sôi nhẹ."
        },
        {
          "title": "Hoàn thiện vị",
          "duration": "1 phút",
          "heat": "Lửa nhỏ",
          "detail": "Kiểm tra nấm đã mềm, thêm tiêu nếu thích; tắt bếp rồi rắc hành.",
          "cue": "Canh thanh, không mặn gắt."
        },
        {
          "title": "Trình bày",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Múc đậu và nấm vào tô trước, chan nước quanh để không làm vỡ đậu, rắc hành trên mặt.",
          "cue": "Khối đậu trắng và nấm nổi rõ như ảnh."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-029",
    "prepTime": 15,
    "cookTime": 35,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-029-1",
          "name": "Sườn heo",
          "quantity": 350,
          "unit": "g"
        },
        {
          "ingredientId": "i-029-2",
          "name": "Cà chua",
          "quantity": 2,
          "unit": "quả"
        },
        {
          "ingredientId": "i-029-3",
          "name": "Hành tây",
          "quantity": 100,
          "unit": "g"
        }
      ],
      "pantry": [
        {
          "name": "Giấm",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "name": "Đường",
          "quantity": 15,
          "unit": "g"
        },
        {
          "name": "Nước mắm",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "name": "Dầu ăn",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "name": "Tỏi",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 200,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi chần",
        "Chảo sâu lòng"
      ],
      "finish": "Sườn vàng nâu áo sốt đỏ cam chua ngọt, hành tây còn miếng.",
      "steps": [
        {
          "title": "Chuẩn bị",
          "duration": "8 phút",
          "heat": "Chưa bật bếp",
          "detail": "Dùng sườn đã chặt miếng 3–4 cm, chần 3 phút rồi bỏ nước và làm sạch bọt bám. Cà chua thái nhỏ, hành tây cắt miếng, tỏi băm.",
          "cue": "Sườn sạch cặn, rau được cắt riêng."
        },
        {
          "title": "Pha sốt",
          "duration": "2 phút",
          "heat": "Không dùng nhiệt",
          "detail": "Hòa giấm, đường, nước mắm và nửa lượng nước; khuấy tan. Nửa nước còn lại để om sườn.",
          "cue": "Sốt có vị chua ngọt cân bằng, chưa cần nêm quá đậm."
        },
        {
          "title": "Áp chảo sườn",
          "duration": "6–8 phút",
          "heat": "Lửa vừa",
          "detail": "Làm nóng dầu, áp chảo sườn cho vàng nhẹ các mặt, lấy ra. Không chiên lửa quá lớn vì bên trong chưa chín.",
          "cue": "Mặt ngoài vàng, không cháy đen."
        },
        {
          "title": "Om cho mềm",
          "duration": "20–25 phút",
          "heat": "Lửa nhỏ",
          "detail": "Phi tỏi, xào cà chua 3 phút, dằm cho ra màu. Cho sườn, sốt và nước còn lại vào, đun sôi rồi hạ lửa, hé nắp. Thêm nước nóng nếu cạn sớm.",
          "cue": "Sườn xiên dễ, thịt đạt ít nhất 63°C; sau nấu nghỉ 3 phút."
        },
        {
          "title": "Thêm hành và cô sốt",
          "duration": "3 phút",
          "heat": "Lửa vừa",
          "detail": "Cho hành tây vào đảo, mở nắp cho sốt sánh. Nếm, thêm chút nước nếu mặn hoặc chua gắt.",
          "cue": "Sốt bám sườn, hành vừa trong và còn giòn."
        },
        {
          "title": "Bày đĩa",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Xếp sườn thành một lớp, rưới sốt và hành lên trên. Không múc quá nhiều dầu.",
          "cue": "Sườn bóng đỏ nâu, thấy rõ từng miếng."
        }
      ]
    },
    "additions": []
  },
  {
    "id": "recipe-030",
    "prepTime": 10,
    "cookTime": 8,
    "cookingGuide": {
      "baseServings": 2,
      "measures": [
        {
          "ingredientId": "i-030-1",
          "name": "Mì",
          "quantity": 150,
          "unit": "g"
        },
        {
          "ingredientId": "i-030-2",
          "name": "Rau cải",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredientId": "i-030-3",
          "name": "Cà rốt",
          "quantity": 80,
          "unit": "g"
        },
        {
          "ingredientId": "i-030-4",
          "name": "Nước tương",
          "quantity": 15,
          "unit": "ml"
        }
      ],
      "pantry": [
        {
          "name": "Dầu ăn",
          "quantity": 15,
          "unit": "ml"
        },
        {
          "name": "Tỏi",
          "quantity": 5,
          "unit": "g"
        },
        {
          "name": "Nước",
          "quantity": 30,
          "unit": "ml"
        }
      ],
      "waiting": "Không cần ướp",
      "equipment": [
        "Nồi chần mì",
        "Chảo rộng",
        "Rổ ráo"
      ],
      "finish": "Sợi mì tơi, rau xanh và cà rốt cam xen đều, không bết sốt.",
      "steps": [
        {
          "title": "Chuẩn bị rau",
          "duration": "5 phút",
          "heat": "Chưa bật bếp",
          "detail": "Rửa rau cải, để ráo rồi cắt đoạn 4 cm, để thân và lá riêng. Cà rốt thái sợi mỏng, tỏi băm.",
          "cue": "Rau ráo để không làm mì ướt."
        },
        {
          "title": "Chần mì",
          "duration": "2–4 phút",
          "heat": "Lửa lớn",
          "detail": "Luộc hoặc ngâm mì theo bao bì nhưng dừng sớm hơn khoảng 1 phút vì còn xào. Vớt, để ráo và trộn một ít dầu từ lượng đã chuẩn bị.",
          "cue": "Sợi mềm nhưng còn độ dai, không nhũn."
        },
        {
          "title": "Phi tỏi",
          "duration": "30 giây",
          "heat": "Lửa vừa",
          "detail": "Cho dầu còn lại vào chảo, phi tỏi đến thơm.",
          "cue": "Tỏi vàng nhạt."
        },
        {
          "title": "Xào rau",
          "duration": "3 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho cà rốt và thân cải vào trước, đảo 2 phút rồi thêm lá. Rưới nước nếu khô; chỉ xào đến gần chín.",
          "cue": "Rau còn xanh, cà rốt hơi mềm."
        },
        {
          "title": "Xào mì",
          "duration": "2–3 phút",
          "heat": "Lửa vừa lớn",
          "detail": "Cho mì vào, rưới nước tương quanh chảo. Dùng đũa và xẻng nâng đảo nhẹ từ dưới lên, không ép nát sợi. Nếu nhiều khẩu phần, chia mẻ.",
          "cue": "Mì nóng đều, sốt bám mỏng và sợi tơi."
        },
        {
          "title": "Bày món",
          "duration": "1 phút",
          "heat": "Tắt bếp",
          "detail": "Gắp mì thành ụ trên đĩa, xếp rau và cà rốt lên mặt. Dùng ngay khi nóng.",
          "cue": "Sợi mì rõ, rau xen đều như ảnh."
        }
      ]
    },
    "additions": []
  }
];
for (const patch of cookingPatches) {
 const r = recipes.find(r => r.id === patch.id); if (!r) continue;
 r.ingredients.push(...patch.additions as Ingredient[]);
 r.prepTime = patch.prepTime; r.cookTime = patch.cookTime;
 r.cookingGuide = patch.cookingGuide;
 r.instructions = patch.cookingGuide.steps.map(s => s.title + ': ' + s.detail + ' ' + s.cue);
 r.totalPrice = r.ingredients.reduce((sum,i)=>sum+i.price*i.quantity,0);
}
