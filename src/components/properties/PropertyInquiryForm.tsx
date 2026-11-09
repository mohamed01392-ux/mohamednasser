"use client";

import React, { useState } from "react";
import { z } from "zod";
import {
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

const inquirySchema = z.object({
  name: z.string().min(2, "يرجى إدخال اسم صحيح"),
  phone: z.string().min(8, "يرجى إدخال رقم هاتف صحيح"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  type: z.enum(["inquiry", "viewing"]),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().min(5, "يرجى كتابة رسالتك أو استفسارك"),
});

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export default function PropertyInquiryForm({
  propertyId,
  propertyTitle,
}: PropertyInquiryFormProps) {
  const [formType, setFormType] = useState<"inquiry" | "viewing">("viewing");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "12:00 م - 02:00 م",
    message: `مرحباً، أود الاستفسار وطلب معاينة للعقار: ${propertyTitle}`,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = inquirySchema.safeParse({
      ...formData,
      type: formType,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.from("inquiries").insert({
          property_id: propertyId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: formType,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
          message: formData.message,
          status: "new",
        });

        if (error) {
          console.warn("Supabase insert inquiry error:", error);
        }
      }

      // Simulate instantaneous graceful completion
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `مرحباً مأوى العقارية، أود الاستفسار بخصوص العقار:\n${propertyTitle}\n(الرمز: ${propertyId})`
  );

  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-card p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-sand uppercase tracking-wider">
          خدمة كونسيرج مأوى
        </span>
        <h3 className="text-xl font-bold text-forest">
          {formType === "viewing" ? "طلب حجز موعد معاينة" : "استفسار عن العقار"}
        </h3>
        <p className="text-xs text-charcoal-500">
          سيقوم مستشارك العقاري بالتواصل معك خلال ساعات قليلة لتنسيق الزيارة أو تزويدك بكافة الملفات الفنية.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-ivory border border-sand/20">
        <button
          type="button"
          onClick={() => setFormType("viewing")}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            formType === "viewing"
              ? "bg-forest text-ivory shadow-sm"
              : "text-charcoal-600 hover:text-forest"
          }`}
        >
          طلب معاينة خاصة
        </button>
        <button
          type="button"
          onClick={() => setFormType("inquiry")}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            formType === "inquiry"
              ? "bg-forest text-ivory shadow-sm"
              : "text-charcoal-600 hover:text-forest"
          }`}
        >
          استفسار عام
        </button>
      </div>

      {submitted ? (
        <div className="p-6 rounded-xl bg-forest-50 border border-forest/20 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-forest text-sand mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-forest text-base">تم استلام طلبك بنجاح</h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            شكراً لاهتمامك. تم تسجيل طلبك لدى فريق مبيعات مأوى، وسيقوم مستشارك العقاري بالتواصل معك على هاتف {formData.phone} في أقرب وقت.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-sand-700 hover:text-forest font-semibold underline pt-2"
          >
            إرسال استفسار إضافي
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700">
              الاسم بالكامل *
            </label>
            <input
              type="text"
              placeholder="مثال: كريم عبد العزيز"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                errors.name ? "border-red-500" : "border-sand/30 focus:border-forest"
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700">
              رقم الهاتف المحمول (واتساب) *
            </label>
            <input
              type="tel"
              placeholder="مثال: 01012345678"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              dir="ltr"
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                errors.phone ? "border-red-500" : "border-sand/30 focus:border-forest"
              }`}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              dir="ltr"
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                errors.email ? "border-red-500" : "border-sand/30 focus:border-forest"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* If viewing, select date and time */}
          {formType === "viewing" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sand" />
                  <span>تاريخ المعاينة المقترح</span>
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  className="w-full h-11 px-3 rounded-xl border border-sand/30 bg-ivory/40 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sand" />
                  <span>الوقت المفضل</span>
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  className="w-full h-11 px-3 rounded-xl border border-sand/30 bg-ivory/40 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                >
                  <option value="10:00 ص - 12:00 م">صباحاً (10:00 - 12:00)</option>
                  <option value="12:00 م - 02:00 م">ظهراً (12:00 - 02:00)</option>
                  <option value="02:00 م - 05:00 م">عصراً (02:00 - 05:00)</option>
                  <option value="05:00 م - 08:00 م">مساءً (05:00 - 08:00)</option>
                </select>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700">
              ملاحظات أو أسئلة إضافية
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className={`w-full p-3 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                errors.message
                  ? "border-red-500"
                  : "border-sand/30 focus:border-forest"
              }`}
            />
            {errors.message && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 text-sand" />
                <span>
                  {formType === "viewing" ? "تأكيد طلب المعاينة" : "إرسال الاستفسار"}
                </span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Direct Contact Options with Abdullah Hussein */}
      <div className="pt-4 border-t border-sand/20 space-y-2">
        <span className="text-[11px] font-bold text-charcoal-700 block text-center">
          أو تواصل فورياً عبر واتساب مع {BRAND.managerName}:
        </span>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/${BRAND.whatsapp1}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>واتساب {BRAND.phone1}</span>
          </a>

          <a
            href={`https://wa.me/${BRAND.whatsapp2}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>واتساب {BRAND.phone2}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
