"use client";
import Image from "next/image";
import styles from "./LandingExperience.module.css";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Leaf,
  Clock,
  Wallet,
  CalendarDays,
  Sparkles,
  ShoppingBasket,
  ChevronDown,
} from "lucide-react";
const plans = [
  {
    name: "Miễn phí",
    price: "0",
    tag: "Cho những ngày muốn thử điều mới",
    features: [
      "3 lượt chat AI mỗi ngày",
      "1 thực đơn cho 1 ngày mỗi tuần",
      "Khám phá công thức và giờ vàng",
    ],
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "VIP",
    price: "19.000",
    tag: "Bớt nghĩ thực đơn. Thêm thời gian cho bạn.",
    features: [
      "25 lượt chat AI mỗi ngày",
      "5 lần tạo thực đơn / 30 ngày",
      "Lên kế hoạch tối đa 3 ngày / lần",
      "Đổi món và danh sách đi chợ",
    ],
    cta: "Chọn VIP",
  },
  {
    name: "VIP Plus",
    price: "39.000",
    tag: "Chăm chút cả căn bếp, trọn vẹn cả tuần.",
    features: [
      "50 lượt chat AI mỗi ngày",
      "15 lần tạo thực đơn / 30 ngày",
      "Lên kế hoạch tối đa 7 ngày / lần",
      "Tủ lạnh và nguyên liệu gần hết hạn",
      "So sánh giỏ hàng, phân tích chi tiêu",
    ],
    cta: "Khám phá VIP Plus",
  },
];
export default function LandingExperience() {
  return (
    <div className={styles.layout}>
      <nav aria-label="Khám phá Smart Grocery" className={styles.sectionNav}>
        <span className={styles.navTitle}>KHÁM PHÁ SMART GROCERY</span>
        <div>{[['loi-ich','Lợi ích'],['cach-hoat-dong','Cách sử dụng'],['tu-lanh','Tủ lạnh thông minh'],['goi-thanh-vien','Các gói'],['cau-hoi','Câu hỏi thường gặp']].map(([id,label])=><a key={id} href={'#'+id}>{label}</a>)}</div>
      </nav>
      <section aria-label="Cảm hứng bữa ăn" className={styles.gallery}>
        <div className={styles.galleryGrid}>
          <div className={styles.gallerySide}>
            <div className={styles.foodImage}>
              <Image
                src="/images/food/recipe-006.webp"
                alt="Món ăn Việt cho bữa cơm nhà"
                fill
                sizes="(max-width: 768px) 33vw, 350px"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-emerald-800 font-semibold text-center">
              Món quen, vị ngon.
            </p>
          </div>
          <div className={styles.galleryMain}>
            <div className={styles.foodImage}>
              <Image
                src="/images/food/recipe-002.webp"
                alt="Bữa cơm ngon được chuẩn bị tại nhà"
                fill
                sizes="(max-width: 768px) 42vw, 470px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-7 pt-20 text-white">
                <p className="text-[10px] sm:text-xs uppercase tracking-[.18em]">
                  BẮT ĐẦU TỪ MỘT BỮA NGON
                </p>
                <p className="text-lg sm:text-3xl font-bold mt-2">
                  Ăn ngon mỗi ngày.
                  <br />
                  Theo cách của bạn.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.galleryNote}>
            <div className="rounded-2xl sm:rounded-3xl bg-[#e3edda] p-3 sm:p-6">
              <Leaf className="text-emerald-700 mb-3" />
              <p className="font-bold text-sm sm:text-xl leading-snug">
                Một căn bếp.
                <br />
                Nhiều cảm hứng.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src="/images/food/deal-007.webp"
                alt="Nguyên liệu tươi cho căn bếp"
                fill
                sizes="(max-width: 768px) 25vw, 280px"
                className="object-cover"
              />
            </div>
            <span className="hidden sm:block text-xs text-gray-500 leading-relaxed">
              Lên kế hoạch vừa đủ.
              <br />
              Mua sắm có chủ đích.
            </span>
          </div>
        </div>
        <div className={styles.trustStrip}>
          {[
            "Bắt đầu không cần thanh toán",
            "Công thức gần gũi, dễ làm",
            "Quyền lợi và hạn mức rõ ràng",
          ].map((t) => (
            <span key={t} className="inline-flex gap-2 items-center">
              <Check size={16} className="text-emerald-700" />
              {t}
            </span>
          ))}
        </div>
      </section>
      <section id="loi-ich" className={styles.benefits}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-emerald-700">
              01 / VÌ SAO CHỌN SMART GROCERY
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 leading-tight">
              Một trợ lý nhỏ.
              <br />
              Cho chuyện bếp núc mỗi ngày.
            </h2>
          </div>
          <p className="text-gray-600 max-w-sm leading-relaxed">
            Từ lúc chưa biết ăn gì đến khi sẵn sàng đi chợ, Smart Grocery cùng
            bạn chuẩn bị từng bước.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              n: "01",
              icon: Wallet,
              title: "Ăn ngon trong ngân sách",
              text: "Nhập khoản tiền bạn muốn dành cho bữa ăn. Tìm món phù hợp với khẩu phần và sở thích.",
              bg: "bg-[#edf2e7]",
            },
            {
              n: "02",
              icon: CalendarDays,
              title: "Thực đơn bớt lặp lại",
              text: "Nhận gợi ý từ AI, xem hướng dẫn nấu và lưu lại kế hoạch cho những ngày bận rộn.",
              bg: "bg-[#fff3dc]",
            },
            {
              n: "03",
              icon: ShoppingBasket,
              title: "Đi chợ có kế hoạch",
              text: "Với VIP, nguyên liệu được tổng hợp thành danh sách để bạn dễ kiểm tra trước khi mua.",
              bg: "bg-[#edeff6]",
            },
          ].map(({ n, icon: Icon, title, text, bg }) => (
            <article key={n} className={`${bg} rounded-[2rem] p-7 sm:p-8`}>
              <div className="flex justify-between items-start">
                <Icon
                  size={30}
                  strokeWidth={1.5}
                  className="text-emerald-900"
                />
                <span className="font-serif italic text-4xl text-black/20">
                  {n}
                </span>
              </div>
              <h3 className="font-bold text-xl mt-10">{title}</h3>
              <p className="text-gray-600 text-sm leading-7 mt-3">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="cach-hoat-dong" className={styles.workflow}>
        <div className="rounded-[2rem] bg-[#e7efdf] p-5 sm:p-9">
          <div className="rounded-2xl bg-white shadow-xl shadow-emerald-950/5 p-5 sm:p-7 -rotate-1">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-700" />
                Bếp của Minh
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                MINH HỌA
              </span>
            </div>
            <div className="mt-5 ml-6 rounded-2xl rounded-tr-sm bg-[#f1f5ec] p-4 text-sm leading-6">
              Mình muốn lên thực đơn cho 2 người, ưu tiên món Việt dễ nấu.
            </div>
            <p className="text-sm text-gray-600 mt-5 mb-4">
              Bắt đầu từ món quen thuộc nhé!
            </p>
            <div className="flex gap-4 items-center rounded-xl border p-3">
              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/food/recipe-006.webp"
                  alt="Minh họa món ăn gợi ý"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-emerald-700 font-bold">
                  GỢI Ý BỮA CƠM NHÀ
                </p>
                <h3 className="font-bold mt-1">
                  Một món ngon, một ý tưởng mới
                </h3>
                <span className="inline-flex text-xs text-gray-500 mt-2 items-center gap-1">
                  <Clock size={12} />
                  Xem công thức và cách nấu
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <span className="border rounded-full px-3 py-2 text-xs text-emerald-700">
                Đổi món · VIP
              </span>
              <span className="border rounded-full px-3 py-2 text-xs text-emerald-700">
                Lưu thực đơn
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[.2em] font-bold text-emerald-700">
            02 / TỪ Ý TƯỞNG ĐẾN THỰC ĐƠN
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-4">
            Bớt một việc phải nghĩ.
            <br />
            Thêm thời gian tận hưởng.
          </h2>
          <p className="mt-5 leading-7 text-gray-600">
            Không cần bắt đầu từ một trang giấy trống. Kể cho AI nghe bạn muốn
            ăn gì, nấu cho bao nhiêu người và dự định chi bao nhiêu.
          </p>
          <ul className="space-y-4 mt-6">
            {[
              "Gợi ý từ công thức có trong website",
              "Điều chỉnh theo khẩu phần và sở thích",
              "Xem chi phí dự kiến trước khi đi chợ",
            ].map((t) => (
              <li key={t} className="flex gap-3 items-center text-sm">
                <span className="rounded-full p-1 bg-emerald-100">
                  <Check size={14} className="text-emerald-800" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 font-bold text-emerald-800 mt-7"
          >
            Thử thực đơn đầu tiên <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section id="tu-lanh" className={styles.pantry}>
        <div>
          <span className="text-xs tracking-[.2em] font-bold text-lime-200">
            03 / CĂN BẾP THÔNG MINH · VIP PLUS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-4">
            Trong tủ còn gì?
            <br />
            Bữa ngon bắt đầu từ đó.
          </h2>
          <p className="text-emerald-100 mt-5 leading-7">
            Ghi lại nguyên liệu đang có, theo dõi hạn dùng và ưu tiên chúng
            trong thực đơn. Danh sách đi chợ chỉ còn những phần bạn cần mua
            thêm.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-lime-300 text-emerald-950 px-5 py-3 rounded-xl font-bold mt-6"
          >
            Khám phá VIP Plus <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold">Tủ lạnh của tôi</h3>
            <span className="text-[10px] text-emerald-200">VÍ DỤ MINH HỌA</span>
          </div>
          {[
            {
              name: "Cà rốt",
              qty: "300 gram",
              note: "Ưu tiên dùng trước",
              image: "deal-013",
              color: "text-amber-200",
            },
            {
              name: "Thịt gà",
              qty: "500 gram",
              note: "Sẵn sàng cho bữa tối",
              image: "deal-007",
              color: "text-lime-200",
            },
            {
              name: "Nguyên liệu đã có",
              qty: "Kiểm tra trước khi mua",
              note: "Mua vừa đủ, nấu thật ngon",
              image: "deal-010",
              color: "text-emerald-200",
            },
          ].map((i) => (
            <div
              key={i.name}
              className="flex gap-3 items-center py-4 border-t border-white/10"
            >
              <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={"/images/food/" + i.image + ".webp"}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{i.name}</p>
                <p className="text-xs text-emerald-100 mt-1">{i.qty}</p>
              </div>
              <p className={"text-xs max-w-24 text-right " + i.color}>
                {i.note}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section id="goi-thanh-vien" className={styles.pricing}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-[.2em] text-emerald-700">
            04 / CHỌN GÓI CỦA BẠN
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Bắt đầu nhỏ. Nấu ăn vui hơn.
          </h2>
          <p className="text-gray-600 mt-4">
            Dùng miễn phí trước, nâng cấp khi bạn cần thêm hỗ trợ.
            <br />
            Gói trả phí có hiệu lực 30 ngày, không tự động thu tiền.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, i) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-[2rem] p-7 sm:p-8 ${i === 1 ? "bg-[#e9f2e2] border-2 border-emerald-700" : "bg-white border border-[#dfe5da]"}`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-7 px-3 py-1 rounded-full text-xs bg-emerald-800 text-white font-bold">
                  CHO NHỊP SỐNG BẬN RỘN
                </span>
              )}
              <h3 className="font-bold text-xl mt-2">{p.name}</h3>
              <p className="text-sm text-gray-600 mt-3 min-h-10">{p.tag}</p>
              <p className="font-extrabold text-4xl tracking-tight mt-7">
                {p.price}
                <span className="text-xl">đ</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {i === 0 ? "Không giới hạn thời hạn" : "/ 30 ngày sử dụng"}
              </p>
              <div className="h-px bg-emerald-900/10 my-6" />
              <ul className="space-y-4 mb-8">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm leading-5"
                  >
                    <Check
                      size={16}
                      className="text-emerald-700 shrink-0 mt-0.5"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className={`mt-auto rounded-xl p-3.5 text-center font-bold transition-colors ${i === 1 ? "bg-emerald-800 text-white hover:bg-emerald-900" : "border border-emerald-800 text-emerald-900 hover:bg-emerald-50"}`}
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section id="cau-hoi" className={styles.faq}>
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[.2em] text-emerald-700">
            05 / GIẢI ĐÁP THẮC MẮC
          </p>
          <h2 className="text-3xl font-extrabold mt-3">Trước khi vào bếp</h2>
        </div>
        {[
          [
            "Tôi có cần trả tiền để bắt đầu không?",
            "Không. Bạn có thể đăng ký miễn phí, xem công thức, mua hàng, chat AI 3 lượt/ngày và tạo 1 thực đơn cho 1 ngày mỗi tuần.",
          ],
          [
            "VIP và VIP Plus khác nhau như thế nào?",
            "VIP hỗ trợ thực đơn tối đa 3 ngày, đổi món và danh sách đi chợ. VIP Plus hỗ trợ tối đa 7 ngày, thêm tủ lạnh, ưu tiên nguyên liệu có sẵn, so sánh giỏ hàng và phân tích chi tiêu.",
          ],
          [
            "Lượt sử dụng được cấp lại khi nào?",
            "Lượt chat đặt lại lúc 00:00 giờ Việt Nam mỗi ngày. Gói miễn phí được cấp lại lượt thực đơn vào thứ Hai. Gói trả phí tính lượt thực đơn theo chu kỳ 30 ngày. Lượt dư không cộng dồn.",
          ],
          [
            "Giá thực phẩm và chi phí thực đơn có chính xác không?",
            "Chi phí thực đơn là ước tính. Website phân biệt giá tham khảo với giá do cửa hàng quản lý và kiểm tra lại giá, tồn kho khi thanh toán.",
          ],
          [
            "Gói trả phí có tự động gia hạn không?",
            "Không tự động thu tiền. Bạn chủ động mua thêm khi cần; thời gian gói mới nối tiếp gói đang còn hiệu lực. Khi hết hạn, tài khoản trở về miễn phí và giữ dữ liệu đã lưu.",
          ],
        ].map(([q, a]) => (
          <details
            key={q}
            className="group border-b border-emerald-900/15 py-5"
          >
            <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-semibold">
              {q}
              <ChevronDown
                size={18}
                className="shrink-0 group-open:rotate-180 transition-transform"
              />
            </summary>
            <p className="mt-4 text-sm leading-7 text-gray-600 pr-6">{a}</p>
          </details>
        ))}
      </section>
      <section className={styles.finalCta}>
        <div className="w-12 h-12 rounded-full bg-white/70 mx-auto flex items-center justify-center">
          <Leaf className="text-emerald-800" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-5">
          Bữa ngon tiếp theo,
          <br />
          bắt đầu từ hôm nay.
        </h2>
        <p className="text-gray-600 mt-4">
          Một tài khoản miễn phí. Thêm cảm hứng cho mỗi bữa ăn.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-3 rounded-xl px-6 py-4 bg-emerald-800 text-white font-bold mt-7 hover:bg-emerald-900"
        >
          Bắt đầu miễn phí <ArrowRight size={18} />
        </Link>
      </section>
      <footer className={styles.footer}>
        <span>AI Smart Grocery · Bữa ngon để AI lo</span>
        <div className="flex gap-5">
          <Link href="/auth/login">Đăng nhập</Link>
          <a href="#goi-thanh-vien">Gói thành viên</a>
          <a href="/images/food/credits.html">Nguồn hình ảnh</a>
        </div>
      </footer>
    </div>
  );
}
