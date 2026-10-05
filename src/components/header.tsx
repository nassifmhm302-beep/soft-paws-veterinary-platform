"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { CartIcon, CloseIcon, MenuIcon, PawIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "خدماتنا" },
  { href: "/doctors", label: "الأطباء" },
  { href: "/branches", label: "الفروع" },
  { href: "/shop", label: "المتجر" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, openDrawer, justAdded } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const lightText = !scrolled && !menuOpen;

  return (
    <header className={`site-header ${scrolled || menuOpen ? "scrolled" : ""}`}>
      <div className="container-xl flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PawIcon className={`h-6 w-6 ${lightText ? "text-white" : "text-burgundy"}`} />
          <span className={`text-lg font-semibold ${lightText ? "text-white" : "text-dark"}`}>
            المخالب الناعمة
            <span className={lightText ? "text-white/70" : "text-dark/50"}> البيطرية</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`link-underline text-sm font-medium transition-colors ${
                lightText ? "text-white/90" : "text-dark/80"
              } ${pathname === link.href ? "font-semibold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            aria-label="فتح سلة المشتريات"
            className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors ${
              lightText ? "text-white hover:bg-white/10" : "text-dark hover:bg-sand"
            }`}
          >
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span
                key={justAdded ?? "count"}
                className="cart-badge-pop absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-burgundy text-[11px] font-semibold text-white"
              >
                {count}
              </span>
            )}
          </button>

          <Link href="/booking" className="btn btn-primary btn-sm hidden sm:inline-flex">
            احجز الآن
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${
              lightText ? "text-white hover:bg-white/10" : "text-dark hover:bg-sand"
            }`}
          >
            {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 z-[999] bg-cream transition-all duration-500 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container-xl flex h-full flex-col justify-center gap-1 pb-24">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-beige/80 py-4 text-2xl heading-section text-dark transition-all duration-500"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/booking" className="btn btn-primary mt-6 w-full">
            احجز الآن
          </Link>
        </nav>
      </div>
    </header>
  );
}
