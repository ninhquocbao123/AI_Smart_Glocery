"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ChefHat,
  Sparkles,
  CalendarDays,
  Refrigerator,
  ShoppingBasket,
  Tag,
  Package,
  Wallet,
  ChartNoAxesCombined,
  LogOut,
  Crown,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Flame,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import AIChatAssistant from "@/components/dashboard/AIChatAssistant";
import { useAppContext } from "@/context/AppContext";
import styles from "./UserShell.module.css";

const groups = [
  {
    label: "KHÔNG GIAN CỦA BẠN",
    items: [
      { href: "/dashboard", label: "Tổng quan", desc: "Trung tâm quản lý bữa ăn & ngân sách", icon: Home },
      { href: "/meal-plan", label: "Khám phá món ăn", desc: "Gợi ý món Việt ngon chuẩn vị", icon: ChefHat },
      { href: "/meal-plan/ai", label: "Thực đơn AI", desc: "Tự động gợi ý theo số người & túi tiền", icon: Sparkles },
      { href: "/meal-plan/weekly", label: "Lịch bữa ăn", desc: "Kế hoạch dinh dưỡng cả tuần", icon: CalendarDays },
      { href: "/pantry", label: "Tủ lạnh của tôi", desc: "Kiểm soát thực phẩm có sẵn", icon: Refrigerator },
    ],
  },
  {
    label: "MUA SẮM & CHI TIÊU",
    items: [
      { href: "/grocery-store", label: "Giỏ nguyên liệu", desc: "Danh sách mua sắm theo siêu thị", icon: ShoppingBasket },
      { href: "/deals", label: "Ưu đãi giờ vàng", desc: "Khung giờ vàng giảm giá sốc", icon: Tag },
      { href: "/orders", label: "Đơn hàng", desc: "Lịch sử mua & trạng thái giao hàng", icon: Package },
      { href: "/budget", label: "Ngân sách", desc: "Hạn mức chi tiêu mỗi tháng", icon: Wallet },
      { href: "/insights", label: "Phân tích chi tiêu", desc: "Báo cáo tiết kiệm & thói quen ăn uống", icon: ChartNoAxesCombined },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { href: "/membership", label: "Gói thành viên", desc: "Quyền lợi VIP Plus & lượt AI", icon: Crown },
      { href: "/profile", label: "Hồ sơ của tôi", desc: "Thông tin cá nhân & khẩu vị", icon: UserRound },
    ],
  },
];

const topNavDropdowns = [
  {
    id: "smart-kitchen",
    label: "Bếp thông minh",
    items: [
      { href: "/meal-plan/ai", label: "Thực đơn AI", desc: "Tự động lên món theo ngân sách", icon: Sparkles, badge: "AI" },
      { href: "/meal-plan/weekly", label: "Lịch bữa ăn", desc: "Sắp xếp thực đơn 7 ngày", icon: CalendarDays },
      { href: "/pantry", label: "Tủ lạnh của tôi", desc: "Quản lý nguyên liệu có sẵn", icon: Refrigerator, badge: "VIP" },
    ],
  },
  {
    id: "shopping",
    label: "Mua sắm",
    items: [
      { href: "/grocery-store", label: "Giỏ nguyên liệu", desc: "Danh sách mua sắm gộp món", icon: ShoppingBasket },
      { href: "/orders", label: "Đơn hàng", desc: "Theo dõi trạng thái giao hàng", icon: Package },
    ],
  },
  {
    id: "spending",
    label: "Chi tiêu",
    items: [
      { href: "/budget", label: "Quản lý ngân sách", desc: "Đặt định mức chi tiêu hàng tháng", icon: Wallet },
      { href: "/insights", label: "Phân tích thông minh", desc: "Biểu đồ chi tiêu & tiết kiệm", icon: ChartNoAxesCombined },
    ],
  },
];

function activeRoute(href: string, path: string) {
  if (href === "/meal-plan") {
    return path === "/meal-plan" || (path.startsWith("/meal-plan/") && !["/meal-plan/ai", "/meal-plan/weekly"].includes(path));
  }
  return path === href;
}

export default function UserShell({ children }: { children: ReactNode }) {
  const { state, cartItemCount, setUser } = useAppContext();
  const router = useRouter();
  const path = usePathname();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openDropdown = (id: string) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        setActiveDropdown(null);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on path change
  useEffect(() => {
    setActiveDropdown(null);
    setAccountMenuOpen(false);
    setMobileDrawerOpen(false);
  }, [path]);

  async function logout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      const r = await fetch("/api/auth/session", { method: "DELETE" });
      if (!r.ok) throw Error("Chưa thể đăng xuất. Vui lòng thử lại.");
      setUser(null);
      router.replace("/auth/login");
    } catch (e) {
      setLogoutError((e as Error).message);
    } finally {
      setLoggingOut(false);
    }
  }

  const current = groups.flatMap((g) => g.items).find((i) => activeRoute(i.href, path));
  const title =
    current?.label ??
    (path === "/checkout"
      ? "Xác nhận mua hàng"
      : path.startsWith("/payment/")
      ? "Thanh toán"
      : path === "/ai-suggestions"
      ? "Gợi ý theo ngân sách"
      : path === "/stores"
      ? "Cửa hàng liên kết"
      : "Bếp của bạn");

  return (
    <div className={styles.shell}>
      <a href="#user-content" className={styles.skip}>
        Chuyển đến nội dung chính
      </a>

      {/* Main Sticky Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Brand Logo */}
          <Link href="/dashboard" className={styles.brand} aria-label="Về trang chủ">
            <div className={styles.logoWrap}>
              <BrandLogo size={40} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Smart Grocery</span>
              <span className={styles.brandSlogan}>
                <Flame size={11} className="text-amber-500 fill-amber-500" /> BỮA NGON ĐỂ AI LO
              </span>
            </div>
          </Link>

          {/* Desktop Top Navigation */}
          <nav className={styles.topNav} aria-label="Điều hướng chính" ref={navRef}>
            <Link
              href="/dashboard"
              className={styles.navLink}
              data-active={path === "/dashboard" ? "true" : undefined}
            >
              Trang chủ
            </Link>

            <Link
              href="/meal-plan"
              className={styles.navLink}
              data-active={activeRoute("/meal-plan", path) ? "true" : undefined}
            >
              Khám phá món ăn
            </Link>

            {topNavDropdowns.map((dropdown) => {
              const isGroupActive = dropdown.items.some((i) => activeRoute(i.href, path));
              const isOpen = activeDropdown === dropdown.id;

              return (
                <div
                  key={dropdown.id}
                  className={styles.dropdownContainer}
                  onMouseEnter={() => openDropdown(dropdown.id)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    type="button"
                    className={styles.dropdownButton}
                    data-active={isGroupActive ? "true" : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                      setActiveDropdown((prev) => (prev === dropdown.id ? null : dropdown.id));
                    }}
                    aria-expanded={isOpen}
                  >
                    <span>{dropdown.label}</span>
                    <ChevronDown
                      size={14}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={styles.dropdownMenu}
                      onMouseEnter={() => openDropdown(dropdown.id)}
                      onMouseLeave={closeDropdown}
                    >
                      {dropdown.items.map(({ href, label, desc, icon: Icon, badge }) => (
                        <Link
                          key={href}
                          href={href}
                          className={styles.dropdownItem}
                          data-active={activeRoute(href, path) ? "true" : undefined}
                          onClick={() => {
                            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                            setActiveDropdown(null);
                          }}
                        >
                          <div className={styles.dropdownIconWrap}>
                            <Icon size={18} strokeWidth={1.8} />
                          </div>
                          <div className={styles.dropdownItemBody}>
                            <div className={styles.dropdownItemTitle}>
                              <span>{label}</span>
                              {badge && (
                                <span
                                  className={`${styles.badge} ${
                                    badge === "AI"
                                      ? styles.badgeAi
                                      : badge === "VIP"
                                      ? styles.badgeVip
                                      : styles.badgeHot
                                  }`}
                                >
                                  {badge}
                                </span>
                              )}
                            </div>
                            <span className={styles.dropdownItemDesc}>{desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/deals"
              className={`${styles.navLink} ${styles.dealsLink}`}
              data-active={path === "/deals" ? "true" : undefined}
            >
              <Tag size={15} />
              <span>Giờ vàng</span>
              <span className={styles.dealsPulse} />
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className={styles.headerActions}>
            {/* Cart Button */}
            <Link
              href="/grocery-store"
              aria-label={`Giỏ hàng, ${cartItemCount} nguyên liệu`}
              className={styles.cartButton}
              data-active={path === "/grocery-store" ? "true" : undefined}
            >
              <div className={styles.cartIconWrapper}>
                <ShoppingBasket size={21} strokeWidth={1.9} />
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className={styles.cartText}>Giỏ hàng</span>
            </Link>

            {/* Profile Dropdown */}
            <div className={styles.accountWrapper} ref={accountRef}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-label="Menu tài khoản"
                aria-expanded={accountMenuOpen}
              >
                <div className={styles.avatar}>
                  {state.user?.name ? state.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className={styles.avatarMeta}>
                  <span className={styles.avatarName}>{state.user?.name || "Tài khoản"}</span>
                  <span className={styles.avatarTier}>
                    {(state.user?.memberTier as string) === "vip" || (state.user as any)?.membershipTier === "vip" ? "VIP Plus" : "Thành viên"}
                  </span>
                </div>
                <ChevronDown size={14} className={styles.avatarChevron} />
              </button>

              {accountMenuOpen && (
                <div className={styles.accountPopover}>
                  <div className={styles.accountHeader}>
                    <p className={styles.popoverName}>{state.user?.name || "Người dùng"}</p>
                    <span className={styles.popoverEmail}>{state.user?.email || "user@smartgrocery.vn"}</span>
                    <div className={styles.popoverTierBadge}>
                      <Crown size={13} className="text-amber-500 fill-amber-500" />
                      <span>{(state.user?.memberTier as string) === "vip" || (state.user as any)?.membershipTier === "vip" ? "Gói VIP Plus" : "Gói Miễn phí"}</span>
                    </div>
                  </div>

                  <div className={styles.accountLinks}>
                    <Link
                      href="/profile"
                      className={styles.accountItem}
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <UserRound size={17} />
                      <span>Hồ sơ & Khẩu vị</span>
                    </Link>
                    <Link
                      href="/membership"
                      className={styles.accountItem}
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <Crown size={17} />
                      <span>Gói thành viên & Lượt AI</span>
                    </Link>
                    <Link
                      href="/orders"
                      className={styles.accountItem}
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <Package size={17} />
                      <span>Đơn hàng đã đặt</span>
                    </Link>
                  </div>

                  <div className={styles.accountFooter}>
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={() => void logout()}
                      className={styles.logoutButton}
                    >
                      <LogOut size={16} />
                      <span>{loggingOut ? "Đang đăng xuất…" : "Đăng xuất tài khoản"}</span>
                    </button>
                    {logoutError && (
                      <p role="alert" className={styles.logoutError}>
                        {logoutError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Mở menu di động"
              className={styles.mobileMenuButton}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className={styles.workspace}>
        {/* Sleek Breadcrumb / Page Trail */}
        <div className={styles.pageTrail}>
          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadcrumbHome}>
              <Home size={14} />
              <span>Smart Grocery</span>
            </Link>
            <ChevronRight size={13} className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbCurrent}>{title}</span>
          </div>
        </div>

        {/* Content Outlet */}
        <main id="user-content" tabIndex={-1} className={styles.content} data-user-page={path.split("/")[1]}>
          {children}
        </main>

        {/* Polished Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <BrandLogo size={28} />
              <div className={styles.footerBrandCopy}>
                <strong>AI Smart Grocery</strong>
                <p>Nền tảng mua sắm thông minh & quản lý dinh dưỡng cho gia đình Việt.</p>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <Link href="/meal-plan">Khám phá món</Link>
              <Link href="/deals">Khung giờ vàng</Link>
              <Link href="/pantry">Tủ lạnh thông minh</Link>
              <Link href="/membership">
                Quyền lợi VIP <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} AI Smart Grocery. Bữa ngon để AI lo.</p>
            <Link href="/photo-credits">Nguồn ảnh & Bản quyền</Link>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (High usability on phones) */}
      <nav className={styles.mobileBottomNav} aria-label="Điều hướng nhanh di động">
        <Link
          href="/dashboard"
          className={styles.mobileNavItem}
          data-active={path === "/dashboard" ? "true" : undefined}
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </Link>
        <Link
          href="/meal-plan"
          className={styles.mobileNavItem}
          data-active={activeRoute("/meal-plan", path) ? "true" : undefined}
        >
          <ChefHat size={20} />
          <span>Món ăn</span>
        </Link>
        <Link
          href="/grocery-store"
          className={styles.mobileNavItem}
          data-active={path === "/grocery-store" ? "true" : undefined}
        >
          <div className="relative">
            <ShoppingBasket size={20} />
            {cartItemCount > 0 && <span className={styles.mobileCartDot} />}
          </div>
          <span>Giỏ hàng</span>
        </Link>
        <Link
          href="/pantry"
          className={styles.mobileNavItem}
          data-active={path === "/pantry" ? "true" : undefined}
        >
          <Refrigerator size={20} />
          <span>Tủ lạnh</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className={styles.mobileNavItem}
          aria-label="Xem thêm menu"
        >
          <Menu size={20} />
          <span>Thêm</span>
        </button>
      </nav>

      {/* Mobile Slide-over Drawer */}
      {mobileDrawerOpen && (
        <div className={styles.drawerBackdrop} onClick={() => setMobileDrawerOpen(false)}>
          <div
            className={styles.drawerContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng di động"
          >
            <div className={styles.drawerHead}>
              <Link
                href="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className={styles.brand}
              >
                <BrandLogo size={36} />
                <div className={styles.brandText}>
                  <span className={styles.brandTitle}>Smart Grocery</span>
                  <span className={styles.brandSlogan}>BỮA NGON ĐỂ AI LO</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Đóng menu"
                className={styles.drawerCloseButton}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Glance */}
            <div className={styles.drawerProfileCard}>
              <div className={styles.avatar}>
                {state.user?.name ? state.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className={styles.drawerProfileInfo}>
                <strong>{state.user?.name || "Người dùng"}</strong>
                <span>{state.user?.email || "user@smartgrocery.vn"}</span>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className={styles.drawerNav}>
              {groups.map((group) => (
                <div key={group.label} className={styles.drawerGroup}>
                  <p className={styles.drawerGroupLabel}>{group.label}</p>
                  <div className={styles.drawerGroupList}>
                    {group.items.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={styles.drawerItem}
                        data-active={activeRoute(href, path) ? "true" : undefined}
                      >
                        <Icon size={19} />
                        <span>{label}</span>
                        {href === "/grocery-store" && cartItemCount > 0 && (
                          <span className={styles.drawerCount}>
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Logout */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => void logout()}
                className={styles.drawerLogout}
              >
                <LogOut size={17} />
                <span>{loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
}
