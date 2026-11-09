"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Heart,
  User,
  PlusCircle,
  Menu,
  X,
  PhoneCall,
  Search,
  ShieldCheck,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (configured) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, [configured]);

  // Read local favorites count
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mawaa_favorites");
      if (saved) {
        const list = JSON.parse(saved);
        setFavoritesCount(Array.isArray(list) ? list.length : 0);
      }
    } catch {
      // ignore
    }

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("mawaa_favorites");
        if (saved) {
          const list = JSON.parse(saved);
          setFavoritesCount(Array.isArray(list) ? list.length : 0);
        } else {
          setFavoritesCount(0);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("favorites-updated", handleStorageChange);
    return () => window.removeEventListener("favorites-updated", handleStorageChange);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/properties", label: "عقاراتنا" },
    { href: "/properties?purpose=sale", label: "للبيع" },
    { href: "/properties?purpose=rent", label: "للإيجار" },
    { href: "/about", label: "عن مأوى" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "luxury-glass shadow-card border-b border-sand/20 py-3"
            : "bg-ivory/95 backdrop-blur-md border-b border-sand/10 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-xl bg-forest flex items-center justify-center text-sand shadow-md group-hover:bg-forest-800 transition-colors">
                <Building2 className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-forest font-arabic flex items-center gap-1.5">
                  {BRAND.nameAr}
                  <span className="w-1.5 h-1.5 rounded-full bg-sand inline-block" />
                </span>
                <span className="text-[10px] tracking-widest text-charcoal-400 font-medium uppercase">
                  MAWAA REAL ESTATE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-forest font-semibold bg-forest/5"
                        : "text-charcoal-700 hover:text-forest hover:bg-forest/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Hotline, Favorites, Account, Add Listing */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* WhatsApp direct pill */}
              <a
                href={BRAND.whatsapp1Url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                title="واتساب مباشر مع أ. عبدالله حسين"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>واتساب: {BRAND.phone1}</span>
              </a>

              {/* Admin Portal Button */}
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest/10 hover:bg-forest hover:text-ivory text-forest text-xs font-bold transition-colors border border-forest/20"
                title="بوابة إدارة العقارات والمشرف"
              >
                <ShieldCheck className="w-4 h-4 text-sand" />
                <span>لوحة الإدارة</span>
              </Link>

              {/* Favorites Link */}
              <Link
                href="/favorites"
                className="relative p-2.5 rounded-xl text-charcoal-700 hover:text-forest hover:bg-forest/5 transition-colors"
                title="المفضلة"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-sand text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* User Dashboard / Login */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-forest/15 hover:border-forest text-forest text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>حسابي</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-charcoal-700 hover:text-forest text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}

              {/* Add Property Button */}
              <Link
                href="/dashboard/properties/add"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white hover:bg-forest-800 text-sm font-medium shadow-sm transition-all hover:shadow-luxury"
              >
                <PlusCircle className="w-4 h-4 text-sand" />
                <span>اعرض عقارك</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/favorites"
                className="relative p-2 rounded-lg text-charcoal-700 hover:bg-forest/5"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute 0 top-0 right-0 w-4 h-4 bg-sand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-charcoal-800 hover:bg-forest/5 focus:outline-none"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand/20 bg-ivory px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 rounded-lg text-base font-medium text-charcoal-800 hover:bg-forest/10 hover:text-forest"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-sand/20 space-y-2">
              {/* Admin shortcut in mobile menu */}
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest-800 text-sand font-bold text-xs border border-sand/30"
              >
                <ShieldCheck className="w-4 h-4 text-sand" />
                <span>لوحة تحكم الإدارة (Admin)</span>
              </Link>

              <Link
                href="/dashboard/properties/add"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-medium shadow-sm text-sm"
              >
                <PlusCircle className="w-5 h-5 text-sand" />
                <span>اعرض عقارك الآن</span>
              </Link>

              {/* Direct WhatsApp Callouts for Mobile */}
              <div className="p-3 rounded-xl bg-forest-50 border border-forest/15 space-y-2">
                <span className="text-[11px] font-bold text-forest block text-center">
                  تواصل مباشر مع {BRAND.managerName} ({BRAND.managerTitle}):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${BRAND.whatsapp1}?text=${encodeURIComponent("مرحباً أ. عبدالله حسين، أود الاستفسار وعرض عقار.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                  >
                    <span>واتساب {BRAND.phone1}</span>
                  </a>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp2}?text=${encodeURIComponent("مرحباً أ. عبدالله حسين، أود الاستفسار وعرض عقار.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-lg bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                  >
                    <span>واتساب {BRAND.phone2}</span>
                  </a>
                </div>
              </div>

              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-forest text-forest font-medium text-xs"
                >
                  <User className="w-4 h-4" />
                  <span>لوحة تحكم المستخدم</span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center py-2.5 rounded-xl border border-charcoal-200 text-charcoal-800 font-medium text-xs text-center"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center py-2.5 rounded-xl bg-sand text-white font-medium text-xs text-center"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
