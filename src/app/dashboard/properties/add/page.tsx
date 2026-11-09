"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import {
  Building2,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MapPin,
  CircleDollarSign,
  Maximize2,
  Bed,
  Bath,
  Info,
} from "lucide-react";
import {
  PROPERTY_TYPES,
  PURPOSES,
  GOVERNORATES,
  FINISHING_TYPES,
  AMENITIES_LIST,
} from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

const propertySchema = z.object({
  title: z.string().min(10, "عنوان العقار يجب أن لا يقل عن 10 أحرف للتوضيح"),
  purpose: z.enum(["sale", "rent"]),
  property_type: z.string().min(1, "يرجى تحديد نوع العقار"),
  governorate: z.string().min(1, "يرجى اختيار المحافظة"),
  district: z.string().min(1, "يرجى اختيار الحي / المنطقة"),
  compound: z.string().optional(),
  address: z.string().optional(),
  price: z.number().min(1000, "يرجى إدخال سعر صحيح بالجنيه المصري"),
  area: z.number().min(10, "يرجى إدخال مساحة صحيحة بالمتر المربع"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  finishing: z.string(),
  description: z.string().min(30, "يرجى كتابة وصف وافٍ للعقار (30 حرفاً على الأقل)"),
});

export default function AddPropertyPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [formData, setFormData] = useState({
    title: "",
    purpose: "sale" as "sale" | "rent",
    property_type: "villa",
    governorate: "القاهرة",
    district: "التجمع الخامس",
    compound: "",
    address: "",
    price: "",
    area: "",
    bedrooms: "4",
    bathrooms: "4",
    finishing: "ultra_super_lux",
    description: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "أمن وحراسة 24/7",
    "موقف سيارات مغطى",
  ]);

  // Images state: URLs or uploaded previews
  const [images, setImages] = useState<
    Array<{ url: string; isPrimary: boolean; file?: File }>
  >([
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      isPrimary: true,
    },
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeGov = GOVERNORATES.find((g) => g.name === formData.governorate);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([
      ...images,
      {
        url: newImageUrl.trim(),
        isPrimary: images.length === 0,
      },
    ]);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (images[index].isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const setPrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = propertySchema.safeParse({
      ...formData,
      price: Number(formData.price),
      area: Number(formData.area),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
    });

    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0].toString()] = issue.message;
      });
      setFieldErrors(errMap);
      return;
    }

    if (images.length === 0) {
      setError("يرجى إضافة صورة واحدة على الأقل للعقار.");
      return;
    }

    setLoading(true);

    try {
      const slug = `${slugify(formData.title)}-${Date.now().toString().slice(-4)}`;

      if (configured) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("يرجى تسجيل الدخول أولاً لإرسال العقار.");
          setLoading(false);
          return;
        }

        // 1. Insert property with status 'pending'
        const { data: propData, error: propError } = await supabase
          .from("properties")
          .insert({
            user_id: user.id,
            title: formData.title,
            slug,
            description: formData.description,
            price: Number(formData.price),
            purpose: formData.purpose,
            property_type: formData.property_type,
            governorate: formData.governorate,
            district: formData.district,
            compound: formData.compound || null,
            address: formData.address || null,
            area: Number(formData.area),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            finishing: formData.finishing,
            amenities: selectedAmenities,
            status: "pending", // Enforce pending status per Section 9
          })
          .select()
          .single();

        if (propError) {
          throw new Error(propError.message);
        }

        // 2. Insert property images
        if (propData && images.length > 0) {
          const imageRows = images.map((img, idx) => ({
            property_id: propData.id,
            url: img.url,
            is_primary: img.isPrimary,
            display_order: idx + 1,
          }));

          await supabase.from("property_images").insert(imageRows);
        }

        setSuccess(true);
      } else {
        // Scaffolding demonstration mode
        await new Promise((r) => setTimeout(r, 600));
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء حفظ العقار.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 border-b border-sand/30 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-sand" />
            <span>إدراج عقار جديد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
            اعرض عقارك على منصة مأوى العقارية
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            يخضع كل عقار معروض للمراجعة والتدقيق الفني والقانوني من قِبل إدارة مأوى قبل نشره في الكتالوج العام لضمان أعلى مستويات الجودة والمصداقية.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-sand/30 shadow-card space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-forest">
              تم إرسال عقارك للمراجعة بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
              حالة العقار الآن: <span className="font-bold text-amber-700">قيد المراجعة (Pending)</span>. سيقوم فريق التدقيق بمراجعة البيانات الفنية والتأكد من مطابقتها للمعايير قبل نشرها في الكتالوج.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                العودة للوحة التحكم
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    title: "",
                    purpose: "sale",
                    property_type: "villa",
                    governorate: "القاهرة",
                    district: "التجمع الخامس",
                    compound: "",
                    address: "",
                    price: "",
                    area: "",
                    bedrooms: "4",
                    bathrooms: "4",
                    finishing: "ultra_super_lux",
                    description: "",
                  });
                }}
                className="px-5 py-2.5 rounded-xl border border-sand/40 text-charcoal-800 text-xs font-semibold hover:bg-ivory"
              >
                إضافة عقار آخر
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basic Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                1. البيانات الأساسية
              </h3>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800">
                  عنوان الإعلان باللغة العربية *
                </label>
                <input
                  type="text"
                  placeholder="مثال: فيلا مستقلة فاخرة بحمام سباحة خاص وحديقة — كمبوند ميفيدا"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                    fieldErrors.title
                      ? "border-red-500"
                      : "border-sand/30 focus:border-forest"
                  }`}
                />
                {fieldErrors.title && (
                  <p className="text-[11px] text-red-500">{fieldErrors.title}</p>
                )}
              </div>

              {/* Purpose & Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    الغرض من العرض *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purpose: e.target.value as "sale" | "rent",
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  >
                    <option value="sale">معروض للبيع</option>
                    <option value="rent">معروض للإيجار</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    نوع العقار المعماري *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) =>
                      setFormData({ ...formData, property_type: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Location */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                2. الموقع الجغرافي
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    المحافظة *
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        governorate: e.target.value,
                        district:
                          GOVERNORATES.find((g) => g.name === e.target.value)
                            ?.districts[0] || "",
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  >
                    {GOVERNORATES.map((g) => (
                      <option key={g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    الحي / المنطقة *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  >
                    {activeGov?.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    اسم المشروع / الكمبوند (إن وجد)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: هايد بارك، سوديك ويست، مراسي"
                    value={formData.compound}
                    onChange={(e) =>
                      setFormData({ ...formData, compound: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    العنوان التفصيلي
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: القطعة 14، المربع الذهبي، التسعين الجنوبي"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>
            </div>

            {/* 3. Specs and Financials */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                3. المواصفات المعمارية والسعر
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    السعر المطلوب (ج.م) *
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 18500000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                      fieldErrors.price
                        ? "border-red-500"
                        : "border-sand/30 focus:border-forest"
                    }`}
                  />
                  {fieldErrors.price && (
                    <p className="text-[11px] text-red-500">{fieldErrors.price}</p>
                  )}
                </div>

                {/* Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    المساحة الإجمالية (م²) *
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 450"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                      fieldErrors.area
                        ? "border-red-500"
                        : "border-sand/30 focus:border-forest"
                    }`}
                  />
                  {fieldErrors.area && (
                    <p className="text-[11px] text-red-500">{fieldErrors.area}</p>
                  )}
                </div>

                {/* Bedrooms */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    غرف النوم
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>

                {/* Bathrooms */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    الحمامات
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Finishing */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800">
                  مستوى التشطيب والتسليم
                </label>
                <select
                  value={formData.finishing}
                  onChange={(e) =>
                    setFormData({ ...formData, finishing: e.target.value })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                >
                  {FINISHING_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800">
                  الوصف التفصيلي للعقار *
                </label>
                <textarea
                  rows={5}
                  placeholder="اكتب وصفاً معمارياً دقيقاً يبرز إطلالة العقار، التقسيم الداخلي، مميزات الحديقة، والتجهيزات الخاصة..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full p-3.5 rounded-xl border text-sm text-charcoal-900 bg-ivory/40 focus:outline-none focus:ring-2 focus:ring-forest/20 ${
                    fieldErrors.description
                      ? "border-red-500"
                      : "border-sand/30 focus:border-forest"
                  }`}
                />
                {fieldErrors.description && (
                  <p className="text-[11px] text-red-500">
                    {fieldErrors.description}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Amenities Checklist */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-4">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                4. الخدمات والمرافق المتوفرة
              </h3>
              <p className="text-xs text-charcoal-500">
                حدد كافة التجهيزات المتوفرة في العقار لزيادة جاذبيته أمام الباحثين.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES_LIST.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between text-right transition-all ${
                        isChecked
                          ? "border-forest bg-forest/5 text-forest"
                          : "border-sand/25 bg-ivory/30 text-charcoal-700 hover:border-sand"
                      }`}
                    >
                      <span className="line-clamp-1">{amenity}</span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mr-2 ${
                          isChecked
                            ? "bg-forest border-forest text-white"
                            : "border-sand/50"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Images Management */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                5. معرض الصور
              </h3>
              <p className="text-xs text-charcoal-500">
                أضف روابط الصور عالية الجودة للعقار. الصورة المحددة كـ &ldquo;رئيسية&rdquo; هي التي ستظهر كغلاف في الكتالوج.
              </p>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="أدخل رابط صورة مباشر (URL)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  dir="ltr"
                  className="flex-1 h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-5 h-11 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4 text-sand" />
                  <span>إضافة الصورة</span>
                </button>
              </div>

              {/* Images Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-charcoal-100 group ${
                      img.isPrimary ? "border-forest ring-2 ring-forest/30" : "border-sand/30"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`صورة ${idx + 1}`}
                      fill
                      className="object-cover"
                    />

                    {img.isPrimary && (
                      <span className="absolute top-2 right-2 bg-forest text-ivory text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-sm">
                        الرئيسية
                      </span>
                    )}

                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(idx)}
                          className="px-2 py-1 rounded bg-white text-forest text-[11px] font-bold hover:bg-sand hover:text-white transition-colors"
                        >
                          تعيين كرئيسية
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="p-6 rounded-2xl bg-forest-50 border border-forest/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-charcoal-600 space-y-0.5 text-center sm:text-right">
                <span className="font-bold text-forest block">
                  جاهز لإرسال العقار؟
                </span>
                <span>
                  سيتم تعيين حالة العقار كـ &ldquo;قيد المراجعة&rdquo; فورياً وإشعار فريق الإشراف.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-sm shadow-md transition-all hover:shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-sand" />
                    <span>إرسال العقار للاعتماد</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
