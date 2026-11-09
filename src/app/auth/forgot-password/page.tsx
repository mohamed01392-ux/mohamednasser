"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Info,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const configured = isSupabaseConfigured();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("يرجى إدخال بريدك الإلكتروني المسجل.");
      return;
    }

    setLoading(true);

    try {
      if (configured) {
        const supabase = createClient();
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}/auth/update-password`,
          });

        if (resetError) {
          setError(resetError.message);
          setLoading(false);
          return;
        }

        setSubmitted(true);
      } else {
        // Clear message if not yet connected
        setError(
          "تنبيه الإعداد: خدمة استعادة كلمة المرور تتطلب ربط Supabase في ملف .env.local. راجع README.md."
        );
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sand/30 shadow-luxury">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-forest justify-center group mb-2"
          >
            <div className="w-11 h-11 rounded-xl bg-forest flex items-center justify-center text-sand shadow-sm">
              <Building2 className="w-6 h-6 stroke-[1.75]" />
            </div>
            <span className="text-2xl font-bold font-arabic tracking-tight">
              {BRAND.nameAr}
            </span>
          </Link>
          <div className="w-12 h-12 rounded-full bg-forest-50 text-forest mx-auto flex items-center justify-center mt-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-charcoal-900">
            استعادة كلمة المرور
          </h2>
          <p className="text-xs text-charcoal-500">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-2xl bg-forest-50 border border-forest/20 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
            <h3 className="font-bold text-forest text-lg">تم إرسال الرابط</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              إذا كان هذا البريد مسجلاً لدينا ({email})، ستتلقى رسالة تحتوي على رابط تعيين كلمة المرور الجديدة في غضون دقائق.
            </p>
            <div className="pt-3">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sand" />
                <span>البريد الإلكتروني المسجل *</span>
              </label>
              <input
                type="email"
                required
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>إرسال رابط الاستعادة</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-sand/20 text-xs text-charcoal-600">
          تذكرت كلمة المرور؟{" "}
          <Link
            href="/auth/login"
            className="font-bold text-forest hover:text-sand transition-colors"
          >
            سجل دخولك الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
