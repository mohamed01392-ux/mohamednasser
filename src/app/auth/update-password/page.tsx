"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const configured = isSupabaseConfigured();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن لا تقل عن 6 أحرف.");
      return;
    }

    setLoading(true);

    try {
      if (configured) {
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }

        setSuccess(true);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء تعيين كلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sand/30 shadow-luxury">
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
            تعيين كلمة مرور جديدة
          </h2>
          <p className="text-xs text-charcoal-500">
            أدخل كلمة المرور الجديدة لحسابك لتسجيل الدخول بأمان
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-2xl bg-forest-50 border border-forest/20 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
            <h3 className="font-bold text-forest text-lg">تم تغيير كلمة المرور</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              تم تحديث كلمة المرور بنجاح. يمكنك الآن الانتقال لتسجيل الدخول بكلمة المرور الجديدة.
            </p>
            <div className="pt-3">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sand" />
                <span>كلمة المرور الجديدة *</span>
              </label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>تحديث كلمة المرور</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
