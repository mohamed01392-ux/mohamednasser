import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle2,
  Share2,
  Heart,
  Calendar,
  Building2,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  FileCheck2,
  Award,
} from "lucide-react";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyInquiryForm from "@/components/properties/PropertyInquiryForm";
import PropertyCard from "@/components/properties/PropertyCard";
import {
  getPropertyBySlugOrId,
  getRelatedProperties,
} from "@/lib/services/properties";
import { formatPrice, formatArea, formatDate } from "@/lib/utils";
import { BRAND, PROPERTY_TYPES, FINISHING_TYPES } from "@/lib/constants";

interface PropertyDetailsPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const property = await getPropertyBySlugOrId(params.slug);
  if (!property) {
    return {
      title: "العقار غير موجود | مأوى العقارية",
    };
  }

  return {
    title: `${property.title} | مأوى العقارية`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const property = await getPropertyBySlugOrId(params.slug);

  if (!property) {
    notFound();
  }

  const related = await getRelatedProperties(property, 3);

  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.property_type)?.label ||
    property.property_type;

  const finishingLabel =
    FINISHING_TYPES.find((f) => f.value === property.finishing)?.label ||
    property.finishing;

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 font-medium">
          <Link href="/" className="hover:text-forest transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-forest transition-colors">
            عقاراتنا
          </Link>
          <span>/</span>
          <span className="text-forest font-semibold truncate max-w-xs sm:max-w-md">
            {property.title}
          </span>
        </nav>

        {/* Gallery Section */}
        <PropertyGallery
          images={property.images || []}
          title={property.title}
        />

        {/* Main Content Layout: Two Columns (Property Details + Sticky Inquiry Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Details (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sand/20">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                      property.purpose === "sale"
                        ? "bg-forest text-ivory"
                        : "bg-sand text-white"
                    }`}
                  >
                    {property.purpose === "sale" ? "معروض للبيع" : "معروض للإيجار"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ivory text-charcoal-800 border border-sand/30">
                    {typeLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>فحص قانوني معتمد</span>
                  </span>
                </div>

                <div className="text-xs text-charcoal-400 font-medium">
                  الرمز: #{property.id.slice(0, 8)}
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 leading-snug">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-charcoal-600 font-medium">
                  <MapPin className="w-4 h-4 text-sand shrink-0" />
                  <span>
                    {property.address ||
                      `${property.compound ? `${property.compound}، ` : ""}${property.district}، ${property.governorate}`}
                  </span>
                </div>
              </div>

              {/* Price Highlight Bar */}
              <div className="p-4 rounded-xl bg-forest-50 border border-forest/15 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-forest-700 font-medium block">
                    {property.purpose === "sale" ? "السعر الإجمالي المطلوب" : "قيمة الإيجار الشهري"}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-forest">
                    {formatPrice(property.price)}
                  </span>
                </div>

                <div className="text-xs text-charcoal-600 space-y-0.5 text-left">
                  <div>متوسط سعر المتر: {formatPrice(Math.round(property.price / property.area))} / م²</div>
                  <div className="text-emerald-700 font-semibold">متاح تسهيلات في السداد</div>
                </div>
              </div>

              {/* Key Architectural Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-ivory/60 border border-sand/20 text-center space-y-1">
                  <Maximize2 className="w-5 h-5 text-sand mx-auto" />
                  <span className="text-xs text-charcoal-500 block">المساحة الإجمالية</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {formatArea(property.area)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-ivory/60 border border-sand/20 text-center space-y-1">
                  <Bed className="w-5 h-5 text-sand mx-auto" />
                  <span className="text-xs text-charcoal-500 block">غرف النوم</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {property.bedrooms} غرف ماستر
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-ivory/60 border border-sand/20 text-center space-y-1">
                  <Bath className="w-5 h-5 text-sand mx-auto" />
                  <span className="text-xs text-charcoal-500 block">عدد الحمامات</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {property.bathrooms} حمامات
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-ivory/60 border border-sand/20 text-center space-y-1">
                  <Award className="w-5 h-5 text-sand mx-auto" />
                  <span className="text-xs text-charcoal-500 block">حالة التشطيب</span>
                  <span className="text-sm font-bold text-charcoal-900 truncate block">
                    {finishingLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-4">
              <h2 className="text-xl font-bold text-forest pb-3 border-b border-sand/20">
                الوصف المعماري والتفصيلي
              </h2>
              <div className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-light whitespace-pre-line space-y-3">
                {property.description}
              </div>
            </div>

            {/* Features and Amenities Grid */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-6">
              <h2 className="text-xl font-bold text-forest pb-3 border-b border-sand/20">
                المزايا والخدمات الاستثنائية
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-ivory/50 border border-sand/20 text-xs font-semibold text-charcoal-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Due Diligence Guarantee */}
            <div className="bg-forest-800 text-ivory rounded-2xl p-6 border border-sand/30 shadow-card flex flex-col sm:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-sand/40 flex items-center justify-center text-sand shrink-0">
                <FileCheck2 className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1 text-center sm:text-right">
                <h4 className="font-bold text-base text-sand-100">
                  ضمان الفحص القانوني المعتمد من &ldquo;مأوى&rdquo;
                </h4>
                <p className="text-xs text-sand-200/80 leading-relaxed font-light">
                  تم فحص أوراق ملكية هذا العقار، التراخيص الإنشائية، وعدم وجود أي مستحقات ضريبية أو نزاعات قضائية بواسطة فريق المستشارين القانونيين التابع لمنصة مأوى.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Sticky Action Box (Col 3) */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <PropertyInquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
            />

            {/* Dedicated Broker Profile: Abdullah Hussein */}
            <div className="bg-white rounded-2xl p-5 border border-sand/30 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-forest text-sand flex items-center justify-center font-bold text-lg">
                  ع
                </div>
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900">
                    {BRAND.managerName}
                  </h4>
                  <span className="text-xs text-sand-600 font-medium">
                    {BRAND.managerTitle}
                  </span>
                </div>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                متاح لتقديم المشورة العقارية، تحديد مواعيد المعاينة، وتسهيل إجراءات التعاقد وحساب التسهيلات.
              </p>
              <div className="pt-1 space-y-2">
                <a
                  href={`https://wa.me/${BRAND.whatsapp1}?text=${encodeURIComponent(`مرحباً أ. عبدالله حسين، أود الاستفسار بخصوص العقار: ${property.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>تواصل واتساب: {BRAND.phone1}</span>
                </a>

                <a
                  href={`https://wa.me/${BRAND.whatsapp2}?text=${encodeURIComponent(`مرحباً أ. عبدالله حسين، أود الاستفسار بخصوص العقار: ${property.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>تواصل واتساب: {BRAND.phone2}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings Section */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-sand/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sand uppercase tracking-wider">
                  خيارات مماثلة
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-forest mt-1">
                  عقارات أخرى قد تنال إعجابك
                </h3>
              </div>
              <Link
                href="/properties"
                className="text-xs font-bold text-forest hover:text-sand transition-colors"
              >
                تصفح الكتالوج بالكامل ←
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <PropertyCard key={rel.id} property={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
