"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-ivory">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-sand/30 shadow-card text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center shadow-sm">
          <AlertCircle className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-charcoal-900">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
            نعتذر عن هذا الخطأ المؤقت. يمكنك إعادة المحاولة الآن أو العودة للصفحة الرئيسية.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-sand" />
            <span>إعادة المحاولة</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-sand/40 text-charcoal-800 text-xs font-semibold hover:bg-ivory transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-forest" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
