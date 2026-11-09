import React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, Home } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-ivory">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-sand/30 shadow-card text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-forest text-sand mx-auto flex items-center justify-center shadow-sm">
          <Building2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-forest">404</span>
          <h1 className="text-xl font-bold text-charcoal-900">
            الصفحة المطلوبة غير موجودة
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
            ربما تم نقل الصفحة أو تغيير مسار العقار. يمكنك العودة للصفحة الرئيسية أو استكشاف الكتالوج.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-sand" />
            <span>الرئيسية</span>
          </Link>
          <Link
            href="/properties"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-sand/40 text-charcoal-800 text-xs font-semibold hover:bg-ivory transition-colors"
          >
            استكشف العقارات
          </Link>
        </div>
      </div>
    </div>
  );
}
