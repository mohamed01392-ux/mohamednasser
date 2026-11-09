import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Award,
  ShieldCheck,
  Compass,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "عن مأوى العقارية — رؤيتنا وفلسفتنا المعمارية",
  description:
    "تعرف على قصة مأوى العقارية، المنصة المصرية الرائدة في تداول واستشارات العقارات الفاخرة والاستثمارية في التجمع، زايد، والساحل الشمالي.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 sm:py-16 bg-ivory space-y-20">
      {/* 1. Header & Story Introduction */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-forest/5 border border-forest/15 text-forest text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-sand" />
          <span>قصة مأوى العقارية</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-forest leading-tight">
          نبتكر معايير جديدة للحياة الراقية والاستثمار العقاري في مصر
        </h1>

        <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-3xl mx-auto font-light">
          تأسست &ldquo;مأوى العقارية&rdquo; كاستجابة لحاجة ملحة في السوق المصري: منصة استشارية فائقة الخصوصية، تجمع بين المعرفة المعمارية العميقة، النزاهة القانونية الصارمة، والانتقاء الحصري للعقارات التي تمثل ملاذاً استثنائياً لأصحابها.
        </p>
      </section>

      {/* 2. Editorial Photography & Architecture Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-luxury md:col-span-2">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="العمارة المعاصرة في مصر"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 left-6 text-white space-y-1">
              <span className="text-xs text-sand font-bold uppercase tracking-wider">
                فلسفة التصميم والمكان
              </span>
              <h3 className="text-xl font-bold">
                بيتك ليس مجرد جدران، بل الامتداد الأصدق لأسلوب حياتك
              </h3>
            </div>
          </div>

          <div className="relative h-96 rounded-3xl overflow-hidden shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
              alt="التشطيبات الفاخرة"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 text-white space-y-1">
              <span className="text-xs text-sand font-bold uppercase tracking-wider">
                معايير الألترا سوبر لوكس
              </span>
              <h3 className="text-lg font-bold">دقة التفاصيل المعمارية</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Pillars of Mawaa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-sand uppercase tracking-wider">
            ركائزنا الراسخة
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-forest mt-1.5 mb-3">
            المبادئ الأربعة التي تحكم كل خطوة نخطوها
          </h2>
          <p className="text-sm text-charcoal-600">
            نحن نلتزم بقيم مهنية لا تقبل المساومة تضع مصلحة العميل وراحة باله في صدارة الأولويات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-sand flex items-center justify-center">
              <Award className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">انتقائية لا تساوم</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              نرفض إدراج ما يقارب 60% من العقارات المعروضة علينا إذا لم تستوفِ المعايير المعمارية والموقع الاستراتيجي المعتمد.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-sand flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">حماية قانونية كاملة</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              فريق محامين متخصصين في عقود الشهر العقاري والاستثمار لضمان سلامة كل توقيع وشرعية كل مستند تعاقدي.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-sand flex items-center justify-center">
              <Compass className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">استشارات مبنية على البيانات</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              نقدم تحليلات دقيقة لحركة الأسعار في المربع الذهبي، زايد، ورأس الحكمة، مع توقعات العوائد الإيجارية ورأس المال.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-sand flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">سرية وخصوصية النخبة</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-light">
              ندرك خصوصية صفقات العقارات الفاخرة، ونضمن سرية تامة لمعلومات الملاك والمشترين في كل مراحل التفاوض.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Leadership & Expertise */}
      <section className="bg-forest text-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-sand uppercase tracking-wider">
                الخبرة وفريق القيادة
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                قيادة تنفيذية واستشارية بإشراف أ. عبدالله حسين
              </h2>
              <p className="text-sm sm:text-base text-sand-100/90 leading-relaxed font-light">
                تدار منصة &ldquo;مأوى العقارية&rdquo; بواسطة المستشار العقاري <strong className="text-sand font-bold">أ. عبدالله حسين</strong> وفريق عمل متخصص يضم نخبة من المستشارين والمهندسين المعماريين وخبراء الاستثمار العقاري، لتقديم تجربة تملك واستثمار استثنائية قائمة على الثقة والشفافية.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-sand-100">
                  <CheckCircle2 className="w-5 h-5 text-sand shrink-0" />
                  <span>علاقات استراتيجية مباشرة مع كبار المطورين العقاريين في مصر</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-sand-100">
                  <CheckCircle2 className="w-5 h-5 text-sand shrink-0" />
                  <span>وصول حصري لوحدات &ldquo;Off-Market&rdquo; وقوائم الملاك السرية</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-sand-100">
                  <CheckCircle2 className="w-5 h-5 text-sand shrink-0" />
                  <span>مكتبان رئيسيان لخدمة العملاء في القاهرة الجديدة والشيخ زايد</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-sand/30 shadow-floating">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="مقر مأوى العقارية"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
          مستعد لبدء رحلتك العقارية القادمة؟
        </h2>
        <p className="text-sm text-charcoal-600 max-w-xl mx-auto">
          فريق مأوى متواجد دائماً لتقديم المشورة الصادقة والمعاينة الشخصية في الوقت الذي يناسب جدول أعمالك.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/properties"
            className="px-8 py-3.5 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all"
          >
            استكشف العقارات المعروضة
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl border border-sand/40 hover:bg-white text-charcoal-800 font-semibold text-sm transition-all"
          >
            تواصل مع الإدارة
          </Link>
        </div>
      </section>
    </div>
  );
}
