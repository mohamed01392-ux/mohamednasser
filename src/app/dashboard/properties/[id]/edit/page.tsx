"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
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
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { getPropertyBySlugOrId } from "@/lib/services/properties";
import { Property } from "@/types/database";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const configured = isSupabaseConfigured();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<
    Array<{ url: string; isPrimary: boolean }>
  >([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const prop = await getPropertyBySlugOrId(propertyId);
        if (prop) {
          setFormData({
            title: prop.title,
            purpose: prop.purpose,
            property_type: prop.property_type,
            governorate: prop.governorate,
            district: prop.district,
            compound: prop.compound || "",
            address: prop.address || "",
            price: prop.price.toString(),
            area: prop.area.toString(),
            bedrooms: prop.bedrooms.toString(),
            bathrooms: prop.bathrooms.toString(),
            finishing: prop.finishing,
            description: prop.description,
          });
          setSelectedAmenities(prop.amenities || []);
          if (prop.images && prop.images.length > 0) {
            setImages(
              prop.images.map((img) => ({
                url: img.url,
                isPrimary: img.is_primary,
              }))
            );
          }
        }
      } catch (err: any) {
        setError(err?.message || "تعذر تحميل بيانات العقار.");
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (configured) {
        const supabase = createClient();
        const { error: updateError } = await supabase
          .from("properties")
          .update({
            title: formData.title,
            purpose: formData.purpose,
            property_type: formData.property_type,
            governorate: formData.governorate,
            district: formData.district,
            compound: formData.compound || null,
            address: formData.address || null,
            price: Number(formData.price),
            area: Number(formData.area),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            finishing: formData.finishing,
            description: formData.description,
            amenities: selectedAmenities,
            status: "pending", // Re-submit for moderation per guidelines
            updated_at: new Date().toISOString(),
          })
          .eq("id", propertyId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء تعديل العقار.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </Link>

        <div className="space-y-2 border-b border-sand/30 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-sand" />
            <span>تحديث بيانات العقار</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
            تعديل: {formData.title || "العقار المعروض"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            عند حفظ التعديلات، يعاد فحص البيانات للتأكد من استيفاء المتطلبات الفنية.
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
              تم تحديث العقار بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              تم إرسال التعديلات بنجاح. حالة العقار الحالية: قيد المراجعة الفنية.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                العودة للوحة التحكم
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                1. البيانات الأساسية
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    الغرض *
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
                    نوع العقار *
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

            {/* Financials & Specs */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-5">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                2. السعر والمواصفات
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    السعر المطلوب (ج.م) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800">
                    المساحة (م²) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>

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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800">
                  الوصف التفصيلي *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand/30 shadow-card space-y-4">
              <h3 className="text-base font-bold text-forest border-b border-sand/20 pb-3">
                3. إدارة الصور
              </h3>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="أدخل رابط صورة جديد..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  dir="ltr"
                  className="flex-1 h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/40 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-5 h-11 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800"
                >
                  إضافة
                </button>
              </div>

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
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(idx)}
                          className="px-2 py-1 rounded bg-white text-forest text-[11px] font-bold"
                        >
                          رئيسية
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded bg-red-600 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl border border-sand/40 text-charcoal-700 text-xs font-semibold hover:bg-white"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-forest hover:bg-forest-800 text-ivory text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 text-sand" />
                    <span>حفظ التعديلات وإرسالها</span>
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
