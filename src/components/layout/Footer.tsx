import React from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { BRAND, POPULAR_DESTINATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-forest text-ivory pt-16 pb-12 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800/80">
          {/* Brand Info & Editorial */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 border border-sand/30 flex items-center justify-center text-sand shadow-inner">
                <Building2 className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-arabic">
                  {BRAND.nameAr}
                </span>
                <span className="text-[10px] tracking-widest text-sand-300 font-medium">
                  {BRAND.nameEn}
                </span>
              </div>
            </div>

            <p className="text-sand-100/90 text-sm leading-relaxed max-w-sm">
              &ldquo;{BRAND.tagline}&rdquo; — {BRAND.description}
            </p>

            <div className="p-3.5 rounded-xl bg-forest-800/80 border border-sand/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sand inline-block" />
                <span className="text-xs font-bold text-white">
                  {BRAND.managerName} — {BRAND.managerTitle}
                </span>
              </div>
              <p className="text-[11px] text-sand-100/80">
                {BRAND.sellPropertyNotice}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={BRAND.whatsapp1Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <span>واتساب: {BRAND.phone1}</span>
                </a>
                <a
                  href={BRAND.whatsapp2Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <span>واتساب: {BRAND.phone2}</span>
                </a>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs text-sand-200/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sand shrink-0" />
                <span>{BRAND.headquarters}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sand shrink-0" />
                <span>{BRAND.zayedBranch}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sand shrink-0" />
                <span>{BRAND.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-sand/20 pb-2">
              الوجهات المميزة
            </h4>
            <ul className="space-y-2 text-sm text-sand-100/80">
              {POPULAR_DESTINATIONS.slice(0, 5).map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/properties?district=${encodeURIComponent(dest.district)}`}
                    className="hover:text-sand transition-colors flex items-center justify-between group"
                  >
                    <span>{dest.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-sand/20 pb-2">
              أنواع العقارات
            </h4>
            <ul className="space-y-2 text-sm text-sand-100/80">
              {PROPERTY_TYPES.slice(0, 5).map((type) => (
                <li key={type.value}>
                  <Link
                    href={`/properties?property_type=${type.value}`}
                    className="hover:text-sand transition-colors flex items-center justify-between group"
                  >
                    <span>{type.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick & Support Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-sand/20 pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm text-sand-100/80">
              <li>
                <Link href="/about" className="hover:text-sand transition-colors">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sand transition-colors">
                  اتصل بالخبراء
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/properties/add"
                  className="hover:text-sand transition-colors"
                >
                  اعرض عقارك للبيع
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-sand transition-colors">
                  لوحة تحكم المستخدم
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-sand transition-colors">
                  بوابة الإدارة (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Content Disclosure Alert */}
        <div className="my-8 p-4 rounded-xl bg-forest-800/60 border border-sand/30 flex items-start gap-3 text-xs text-sand-100">
          <ShieldAlert className="w-5 h-5 text-sand shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sand-200">
              تنويه المحتوى التجريبي والتطويري (Demo Notice)
            </p>
            <p className="text-sand-100/80 leading-relaxed">
              هذه المنصة نموذج إنتاجي احترافي متكامل مصمم لعرض إمكانيات شركة &ldquo;مأوى العقارية&rdquo;. جميع العقارات والصور المعروضة في النسخة التجريبية هي نماذج افتراضية لأغراض العرض والتطوير البرمجي وليست معروضة للبيع الفعلي.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-200/70">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {BRAND.nameAr} | {BRAND.nameEn} — بإدارة {BRAND.managerName}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={BRAND.whatsapp1Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="تواصل واتساب"
            >
              <Phone className="w-3.5 h-3.5 text-sand" />
              <span dir="ltr">{BRAND.phone1} (واتساب)</span>
            </a>
            <a
              href={BRAND.whatsapp2Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="تواصل واتساب"
            >
              <Phone className="w-3.5 h-3.5 text-sand" />
              <span dir="ltr">{BRAND.phone2} (واتساب)</span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-sand" />
              <span>{BRAND.email}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
