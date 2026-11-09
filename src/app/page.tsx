import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Users,
  Search,
  Eye,
  KeyRound,
  FileCheck,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearchFilter from "@/components/properties/PropertySearchFilter";
import {
  getFeaturedProperties,
  getProperties,
} from "@/lib/services/properties";
import {
  BRAND,
  POPULAR_DESTINATIONS,
  PROPERTY_TYPES,
} from "@/lib/constants";

export default async function HomePage() {
  const featured = await getFeaturedProperties(4);
  const latestResult = await getProperties({ limit: 4, sort: "newest" });
  const latest = latestResult.properties;

  return (
    <div className="flex flex-col space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-forest text-white">
        {/* Background Editorial Architectural Photography */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="مأوى العقارية — أرقى الفيلات في مصر"
            fill
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-in fade-in zoom-in-105 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-transparent to-forest/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-28">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/80 border border-sand/40 text-sand text-xs sm:text-sm font-semibold mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-sand" />
            <span>{BRAND.tagline} • بإدارة {BRAND.managerName}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ivory leading-tight sm:leading-snug mb-6">
            المكان الذي تستحق أن تنتمي إليه.
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-sand-100/90 leading-relaxed font-light mb-10">
            اكتشف مجموعة مختارة من العقارات السكنية والتجارية في مختلف أنحاء مصر.
            نساعدك على الوصول إلى المكان المناسب لأسلوب حياتك واستثمارك.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/properties"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sand hover:bg-sand-600 text-white font-bold text-sm shadow-luxury hover:shadow-luxury-hover transition-all flex items-center justify-center gap-2 group"
            >
              <span>اكتشف العقارات</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard/properties/add"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-900 border border-sand/30 text-ivory font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-sand" />
              <span>اعرض عقارك</span>
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="pt-8 border-t border-sand/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sand">15+</div>
              <div className="text-xs text-sand-200/80 font-medium mt-1">عاماً من الخبرة العقارية</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sand">12B+</div>
              <div className="text-xs text-sand-200/80 font-medium mt-1">جنيه حجم الصفقات المنجزة</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sand">100%</div>
              <div className="text-xs text-sand-200/80 font-medium mt-1">فحص قانوني وموثوق</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sand">5,000+</div>
              <div className="text-xs text-sand-200/80 font-medium mt-1">عميل يثقون في مأوى</div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING SEARCH FILTER CONTAINER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        <Suspense fallback={<div className="h-40 bg-white rounded-2xl animate-pulse" />}>
          <PropertySearchFilter />
        </Suspense>
      </section>

      {/* 2. FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-sand" />
              <span>مختارات مأوى الحصرية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              عقارات استثنائية صُممت لأصحاب الذوق الرفيع
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-sm font-bold text-forest hover:text-sand transition-colors group self-start md:self-auto"
          >
            <span>عرض كل العقارات الفاخرة</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-sand" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} featuredBadge />
          ))}
        </div>
      </section>

      {/* 3. SEARCH BY PROPERTY TYPE */}
      <section className="bg-sand-50/60 py-16 border-y border-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sand uppercase tracking-wider">
              خيارات تلبي تطلعاتك
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mt-1.5 mb-3">
              تصفح العقارات حسب النمط المعماري
            </h2>
            <p className="text-sm text-charcoal-600">
              سواء كنت تبحث عن فيلا مستقلة بحديقة خاصة، بنتهاوس بفيو بانورامي، أو مقر إداري ذكي لشركتك.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {PROPERTY_TYPES.slice(0, 8).map((type) => (
              <Link
                key={type.value}
                href={`/properties?property_type=${type.value}`}
                className="group bg-white rounded-2xl p-6 border border-sand/30 hover:border-forest hover:shadow-luxury transition-all text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-ivory text-forest group-hover:bg-forest group-hover:text-sand transition-colors flex items-center justify-center shadow-inner">
                  <Building2 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-charcoal-900 group-hover:text-forest transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1 line-clamp-1">
                    {type.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-sand" />
              <span>مواقع استراتيجية متميزة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              أبرز الوجهات العقارية الأكثر طلباً في مصر
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              href={`/properties?district=${encodeURIComponent(dest.district)}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forest/80 text-sand backdrop-blur-md">
                  {dest.propertiesCount}
                </span>
              </div>

              <div className="absolute bottom-6 right-6 left-6 text-white space-y-1.5">
                <h3 className="text-xl font-bold text-white group-hover:text-sand transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-sand-100/80 line-clamp-2">
                  {dest.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-sand">
                  <span>استكشف العقارات المتوفرة</span>
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. WHY MAWAA? */}
      <section className="bg-forest text-ivory py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sand uppercase tracking-wider">
              فلسفة مأوى
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-4">
              لماذا يختار النخبة &ldquo;مأوى العقارية&rdquo;؟
            </h2>
            <p className="text-sm sm:text-base text-sand-100/90 leading-relaxed font-light">
              نحن لا نكتفي بعرض العقارات، بل نبتكر تجربة اقتناء واستثمار ترتكز على الشفافية المطلقة، السرية التامة، والمشورة الذكية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-forest-800/60 border border-sand/20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-900 border border-sand/30 flex items-center justify-center text-sand">
                <Award className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-white">انتقاء استثنائي حصري</h3>
              <p className="text-xs sm:text-sm text-sand-100/80 leading-relaxed">
                تخضع كل وحدة تُعرض في مأوى لمعايير تدقيق صارمة من حيث جودة البناء، قانونية التراخيص، وتميز الموقع.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/60 border border-sand/20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-900 border border-sand/30 flex items-center justify-center text-sand">
                <Compass className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-white">استشارات استثمارية ذكية</h3>
              <p className="text-xs sm:text-sm text-sand-100/80 leading-relaxed">
                تحليلات عميقة لمعدلات العائد الاستثماري (ROI) وإمكانات إعادة البيع في السوق العقاري المصري سريع النمو.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/60 border border-sand/20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-900 border border-sand/30 flex items-center justify-center text-sand">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-white">أمان قانوني متكامل</h3>
              <p className="text-xs sm:text-sm text-sand-100/80 leading-relaxed">
                فريق قانوني متخصص يراجع الملكية، مستندات الشهر العقاري، وصحة التعاقدات لضمان أمان مدخراتك بنسبة 100%.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/60 border border-sand/20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-900 border border-sand/30 flex items-center justify-center text-sand">
                <Users className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-white">خدمة كونسيرج خاصة</h3>
              <p className="text-xs sm:text-sm text-sand-100/80 leading-relaxed">
                مستشار عقاري مخصص يرافقك طوال الرحلة، مع تنظيم جولات المعاينة وتسهيل كافة الإجراءات بأعلى درجات الخصوصية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sand uppercase tracking-wider">
            خطوات ميسرة
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-forest mt-1.5 mb-3">
            رحلتك مع مأوى لامتلاك بيتك القادم
          </h2>
          <p className="text-sm text-charcoal-600">
            أربع خطوات واضحة ومدروسة تفصلك عن اقتناء وحدتك السكنية أو الاستثمارية المثالية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card text-center space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-forest text-sand text-sm font-bold flex items-center justify-center mx-auto">
              1
            </span>
            <div className="w-12 h-12 rounded-xl bg-sand-50 text-forest mx-auto flex items-center justify-center">
              <Search className="w-6 h-6 text-forest" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">استكشف العقارات</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              ابحث وفلتر بدقة حسب المنطقة، السعر، والمواصفات الفنية مع صور واقعية ومعلومات شفافة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card text-center space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-forest text-sand text-sm font-bold flex items-center justify-center mx-auto">
              2
            </span>
            <div className="w-12 h-12 rounded-xl bg-sand-50 text-forest mx-auto flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-forest" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">استشر خبيرك الخاص</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              تواصل مع مستشارك المعتمد للحصول على التحليلات المالية وخطط السداد المتاحة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card text-center space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-forest text-sand text-sm font-bold flex items-center justify-center mx-auto">
              3
            </span>
            <div className="w-12 h-12 rounded-xl bg-sand-50 text-forest mx-auto flex items-center justify-center">
              <Eye className="w-6 h-6 text-forest" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">عاين على أرض الواقع</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              احجز موعد معاينة خاصة مريحة لتفقد الموقع، التشطيبات، والخدمات المحيطة بالوحدة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-card text-center space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-forest text-sand text-sm font-bold flex items-center justify-center mx-auto">
              4
            </span>
            <div className="w-12 h-12 rounded-xl bg-sand-50 text-forest mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-forest" />
            </div>
            <h3 className="font-bold text-base text-charcoal-900">امتلك بكل أمان</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              توقيع العقود واستلام مفاتيح بيتك الجديد مع توثيق قانوني شامل وتسهيلات بنكية.
            </p>
          </div>
        </div>
      </section>

      {/* 7. LATEST PROPERTY LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-sand" />
              <span>أحدث الإضافات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              أحدث العقارات المضافة لقائمتنا
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-sm font-bold text-forest hover:text-sand transition-colors group self-start md:self-auto"
          >
            <span>استعراض كافة الوحدات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-sand" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 8. DEDICATED SELLER CALLOUT: عرض وتسويق عقارك */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sand-50/90 rounded-3xl p-8 sm:p-12 border-2 border-sand/40 shadow-card flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-right">
            <span className="inline-block px-3.5 py-1 rounded-full bg-forest text-sand text-xs font-bold">
              خدمة الملاك والمستثمرين
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
              حابب تعرض عقارك وتبيعه أو تأجره بأعلى قيمة سوقية؟
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed font-light">
              يسعدنا في &ldquo;مأوى العقارية&rdquo; استقبال طلبك مباشرة. تواصل مع المستشار العقاري{" "}
              <strong className="text-forest font-bold">{BRAND.managerName}</strong> وسنقوم بمعاينة الوحدة وتصويرها باحترافية وتسويقها فوراً لنخبة العملاء الجادين.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <a
              href={`https://wa.me/${BRAND.whatsapp1}?text=${encodeURIComponent("مرحباً أ. عبدالله حسين، حابب أعرض عقاري للبيع/الإيجار معكم في مأوى العقارية.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>تواصل واتساب: {BRAND.phone1}</span>
            </a>

            <a
              href={`https://wa.me/${BRAND.whatsapp2}?text=${encodeURIComponent("مرحباً أ. عبدالله حسين، حابب أعرض عقاري للبيع/الإيجار معكم في مأوى العقارية.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>تواصل واتساب: {BRAND.phone2}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER INQUIRY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-forest text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-floating border border-sand/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-sand/20 border border-sand/40 text-sand text-xs font-bold">
              استشارة كبار العملاء
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-ivory leading-snug">
              تبحث عن عقار استثنائي بمواصفات حصرية لم تُعرض بعد؟
            </h2>
            <p className="text-sm sm:text-base text-sand-100/90 leading-relaxed font-light">
              يتيح لك قسم المبيعات الخاصة الوصول إلى صفقات &ldquo;Off-Market&rdquo; في أفخم كمبوندات التجمع الخامس، زايد، والساحل الشمالي دون نشرها علناً.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sand hover:bg-sand-600 text-white font-bold text-sm shadow-luxury transition-all text-center"
              >
                تحدث مع مستشارك العقاري
              </Link>
              <a
                href={`tel:${BRAND.hotline}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-sand/40 hover:bg-forest-800 text-ivory font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-sand" />
                <span>الخط الساخن: {BRAND.hotline}</span>
              </a>
            </div>
          </div>

          {/* Decorative Background graphic */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sand/10 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block">
            <Building2 className="w-full h-full text-sand stroke-[0.5]" />
          </div>
        </div>
      </section>
    </div>
  );
}
