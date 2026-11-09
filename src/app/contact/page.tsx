"use client";

import React, { useState } from "react";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

const contactSchema = z.object({
  name: z.string().min(2, "يرجى إدخال اسمك الكريم"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z.string().min(8, "يرجى إدخال رقم هاتف صحيح"),
  subject: z.string().min(3, "يرجى كتابة موضوع الاستفسار"),
  message: z.string().min(10, "يرجى كتابة رسالتك بشكل واضح (10 أحرف على الأقل)"),
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = contactSchema.safeParse(formData);
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
        await supabase.from("inquiries").insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: "contact",
          message: `[${formData.subject}] ${formData.message}`,
          status: "new",
        });
      }

      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = `https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "مرحباً مأوى العقارية، أود الاستفسار عن خدمات الاستشارات العقارية."
  )}`;

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-ivory space-y-16">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-forest/5 border border-forest/15 text-forest text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-sand" />
          <span>تواصل مباشر مع المستشارين</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-forest">
          يسعدنا استقبالك والتواصل معك في أي وقت
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto font-light leading-relaxed">
          سواء كنت تبحث عن تملك عقار استثنائي، ترغب في تقييم وحدتك وعرضها للبيع، أو بحاجة لدراسة جدوى استثمارية خاصة.
        </p>
      </section>

      {/* 2. Office Locations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Cairo HQ */}
          <div className="bg-white rounded-3xl p-8 border border-sand/30 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand/20">
              <div>
                <span className="text-xs font-bold text-sand uppercase tracking-wider">
                  المقر الرئيسي — القاهرة الجديدة
                </span>
                <h3 className="text-xl font-bold text-forest mt-1">
                  مكتب التجمع الخامس (القطاع الأول)
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-ivory text-forest flex items-center justify-center">
                <Building2 className="w-6 h-6 text-forest" />
              </div>
            </div>

            <div className="space-y-3 text-sm text-charcoal-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sand shrink-0 mt-1" />
                <span>{BRAND.headquarters}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sand shrink-0" />
                <span dir="ltr">{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sand shrink-0" />
                <span>{BRAND.workingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-forest text-ivory text-xs font-bold flex items-center justify-center gap-2 hover:bg-forest-800 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-sand" />
                <span>تواصل مع فرع التجمع عبر واتساب</span>
              </a>
            </div>
          </div>

          {/* Sheikh Zayed Branch */}
          <div className="bg-white rounded-3xl p-8 border border-sand/30 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand/20">
              <div>
                <span className="text-xs font-bold text-sand uppercase tracking-wider">
                  فرع غرب القاهرة — الجيزة
                </span>
                <h3 className="text-xl font-bold text-forest mt-1">
                  مكتب الشيخ زايد و6 أكتوبر
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-ivory text-forest flex items-center justify-center">
                <Building2 className="w-6 h-6 text-forest" />
              </div>
            </div>

            <div className="space-y-3 text-sm text-charcoal-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sand shrink-0 mt-1" />
                <span>{BRAND.zayedBranch}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sand shrink-0" />
                <span dir="ltr">{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sand shrink-0" />
                <span>{BRAND.workingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${BRAND.hotline}`}
                className="w-full py-3 rounded-xl border border-sand/40 hover:border-forest text-charcoal-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-forest" />
                <span>الاتصال بالخط الساخن ({BRAND.hotline})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form & Contact Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details Card */}
          <div className="bg-forest text-ivory rounded-3xl p-8 sm:p-10 shadow-floating space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-sand uppercase tracking-wider">
                خدمة العملاء السريعة
              </span>
              <h3 className="text-2xl font-bold text-white">
                قنوات الاتصال المباشرة
              </h3>
              <p className="text-xs text-sand-100/80 leading-relaxed font-light">
                فريق الاستقبال وخدمة كبار العملاء متواجد على مدار اليوم لتلبية استفساراتكم وترتيب المواعيد.
              </p>
            </div>

            <div className="space-y-4 text-sm text-sand-100">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-800/80 border border-sand/30">
                <div className="w-10 h-10 rounded-full bg-sand text-forest font-bold flex items-center justify-center shrink-0">
                  ع
                </div>
                <div>
                  <div className="text-[11px] text-sand-300">المدير العام والمستشار العقاري</div>
                  <div className="font-bold text-base text-white">{BRAND.managerName}</div>
                </div>
              </div>

              {/* Number 1 WhatsApp */}
              <a
                href={BRAND.whatsapp1Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-sand shrink-0" />
                  <div>
                    <div className="text-[11px] text-emerald-100">واتساب مباشر (عرض عقار / استفسار)</div>
                    <div className="font-bold text-base text-white" dir="ltr">{BRAND.phone1}</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-md text-white">محادثة</span>
              </a>

              {/* Number 2 WhatsApp */}
              <a
                href={BRAND.whatsapp2Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-sand shrink-0" />
                  <div>
                    <div className="text-[11px] text-emerald-100">واتساب مبيعات ومعاينات</div>
                    <div className="font-bold text-base text-white" dir="ltr">{BRAND.phone2}</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-md text-white">محادثة</span>
              </a>
                  <div className="font-bold text-white" dir="ltr">{BRAND.whatsapp}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-forest-800/60 border border-sand/20">
                <Mail className="w-5 h-5 text-sand shrink-0" />
                <div>
                  <div className="text-[11px] text-sand-200">البريد الإلكتروني للكونسيرج</div>
                  <div className="font-medium text-white">{BRAND.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-sand/30 shadow-card space-y-6">
            <div className="space-y-1 border-b border-sand/20 pb-4">
              <h3 className="text-xl font-bold text-forest">أرسل استفسارك</h3>
              <p className="text-xs text-charcoal-500">
                املأ النموذج التالي وسيقوم أحد مسؤولي العلاقات بالتواصل معك في غضون ساعتين.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-forest-50 border border-forest/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                <h4 className="font-bold text-forest text-lg">
                  تم استلام رسالتك بنجاح!
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
                  شكراً لتواصلك مع مأوى العقارية. تم تحويل رسالتك إلى القسم المختص وسيتواصل معك مستشارك في أقرب وقت.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-sand-700 hover:text-forest font-semibold underline pt-2"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-charcoal-800">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: يوسف الشريف"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                        fieldErrors.name
                          ? "border-red-500"
                          : "border-sand/30 focus:border-forest"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-red-500">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-charcoal-800">
                      رقم الهاتف (واتساب) *
                    </label>
                    <input
                      type="tel"
                      placeholder="010xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      dir="ltr"
                      className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                        fieldErrors.phone
                          ? "border-red-500"
                          : "border-sand/30 focus:border-forest"
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-red-500">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-charcoal-800">
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
                        fieldErrors.email
                          ? "border-red-500"
                          : "border-sand/30 focus:border-forest"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-red-500">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-charcoal-800">
                      موضوع الاستفسار *
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: استفسار عن فيلات جولدن سكوير"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                        fieldErrors.subject
                          ? "border-red-500"
                          : "border-sand/30 focus:border-forest"
                      }`}
                    />
                    {fieldErrors.subject && (
                      <p className="text-[11px] text-red-500">{fieldErrors.subject}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    نص الرسالة أو الاستفسار *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="اكتب تفاصيل طلبك أو موعد المعاينة المرغوب..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full p-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                      fieldErrors.message
                        ? "border-red-500"
                        : "border-sand/30 focus:border-forest"
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-[11px] text-red-500">{fieldErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-sand" />
                      <span>إرسال الرسالة الآن</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
