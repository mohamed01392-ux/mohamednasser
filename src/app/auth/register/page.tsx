"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

const registerSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
  phone: z.string().min(8, "يرجى إدخال رقم هاتف صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 خانات"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const configured = isSupabaseConfigured();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0].toString()] = issue.message;
      });
      setFieldErrors(errMap);
      return;
    }

    setLoading(true);

    try {
      if (configured) {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        setSuccess(true);
      } else {
        setError(
          "تنبيه الإعداد: لم يتم ربط مشروع Supabase الفعلي في ملف .env.local. راجع README.md لإضافة المفاتيح."
        );
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع أثناء إنشاء الحساب.");
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
          <h2 className="text-2xl font-extrabold text-charcoal-900">
            إنشاء حساب شخصي جديد
          </h2>
          <p className="text-xs text-charcoal-500">
            انضم إلى مجتمع مأوى واستمتع بحفظ العقارات وتتبع المعاينات
          </p>
        </div>

        {/* Configuration Notice */}
        {!configured && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>إشعار إعداد بيئة العمل (Supabase Scaffolding)</span>
            </div>
            <p className="leading-relaxed">
              تطبيق المصادقة الحقيقي جاهز بالكامل وينتظر إدخال مفاتيح Supabase في{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">
                .env.local
              </code>
              .
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-2xl bg-forest-50 border border-forest/20 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
            <h3 className="font-bold text-forest text-lg">تم إنشاء الحساب بنجاح</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              إذا كانت رسائل التحقق مفعلة في مشروعك على Supabase، يرجى تفقد بريدك الإلكتروني لتأكيد التسجيل، أو تسجيل الدخول مباشرة.
            </p>
            <div className="pt-3">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                الانتقال لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sand" />
                <span>الاسم الكامل *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أحمد عبد الله"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/50 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                  fieldErrors.fullName
                    ? "border-red-500"
                    : "border-sand/30 focus:border-forest"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-500">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sand" />
                <span>رقم الهاتف *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                dir="ltr"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/50 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                  fieldErrors.phone
                    ? "border-red-500"
                    : "border-sand/30 focus:border-forest"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[11px] text-red-500">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sand" />
                <span>البريد الإلكتروني *</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                dir="ltr"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/50 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                  fieldErrors.email
                    ? "border-red-500"
                    : "border-sand/30 focus:border-forest"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sand" />
                <span>كلمة المرور (6 خانات على الأقل) *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  dir="ltr"
                  className={`w-full h-11 px-3.5 pr-3.5 pl-10 rounded-xl border text-sm text-charcoal-900 bg-ivory/50 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                    fieldErrors.password
                      ? "border-red-500"
                      : "border-sand/30 focus:border-forest"
                  }`}
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
              {fieldErrors.password && (
                <p className="text-[11px] text-red-500">{fieldErrors.password}</p>
              )}
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
                <span>إنشاء الحساب</span>
              )}
            </button>
          </form>
        )}

        {/* Login link */}
        <div className="text-center pt-4 border-t border-sand/20 text-xs text-charcoal-600">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/auth/login"
            className="font-bold text-forest hover:text-sand transition-colors"
          >
            سجل دخولك هنا
          </Link>
        </div>
      </div>
    </div>
  );
}
