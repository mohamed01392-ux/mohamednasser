"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setLoading(true);

    try {
      if (configured) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(
            authError.message === "Invalid login credentials"
              ? "بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور."
              : authError.message
          );
          setLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        setError(
          "تنبيه الإعداد: لم يتم ربط مفاتيح Supabase بعد في ملف .env.local (راجع تعليمات الإعداد في README.md). يرجى إضافة NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
        );
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sand/30 shadow-luxury">
      {/* Logo and Header */}
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
        <h2 className="text-2xl font-extrabold text-charcoal-900">
          تسجيل الدخول إلى حسابك
        </h2>
        <p className="text-xs text-charcoal-500">
          أهلاً بك مجدداً في بوابة النخبة العقارية
        </p>
      </div>

      {/* Configuration Notice if Supabase not linked */}
      {!configured && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>ملاحظة بيئة التطوير (Supabase Setup)</span>
          </div>
          <p className="leading-relaxed">
            مشروع Supabase الفعلي ينتظر تزويده بمتغيرات البيئة في{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">
              .env.local
            </code>
            . تم تجهيز كافة دوال ومصادقة Supabase SSR والجداول والـ RLS.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-sand" />
            <span>البريد الإلكتروني</span>
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

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sand" />
              <span>كلمة المرور</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-sand-700 hover:text-forest transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full h-11 px-3.5 pr-3.5 pl-10 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>تسجيل الدخول</span>
          )}
        </button>
      </form>

      {/* Register link */}
      <div className="text-center pt-4 border-t border-sand/20 text-xs text-charcoal-600">
        ليس لديك حساب بعد؟{" "}
        <Link
          href="/auth/register"
          className="font-bold text-forest hover:text-sand transition-colors"
        >
          أنشئ حسابك الجديد الآن
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <Suspense
        fallback={
          <div className="max-w-md w-full h-96 bg-white rounded-3xl border border-sand/30 shadow-luxury animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
