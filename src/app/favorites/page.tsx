"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Building, ArrowLeft, Trash2 } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types/database";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);

      if (configured) {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data } = await supabase
              .from("favorites")
              .select("*, property:properties(*, images:property_images(*))")
              .eq("user_id", user.id);

            if (data && data.length > 0) {
              const list = data
                .map((d: any) => d.property)
                .filter(Boolean) as Property[];
              setFavoriteProperties(list);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Supabase favorites load error:", err);
        }
      }

      // Read from local storage
      try {
        const saved = localStorage.getItem("mawaa_favorites");
        if (saved) {
          const ids: string[] = JSON.parse(saved);
          const list = MOCK_PROPERTIES.filter((p) => ids.includes(p.id));
          setFavoriteProperties(list);
        } else {
          setFavoriteProperties([]);
        }
      } catch {
        setFavoriteProperties([]);
      }

      setLoading(false);
    }

    fetchFavorites();

    const handleUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [configured]);

  const handleClearAll = () => {
    try {
      localStorage.removeItem("mawaa_favorites");
      setFavoriteProperties([]);
      window.dispatchEvent(new Event("favorites-updated"));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/30 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sand uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-sand text-sand" />
              <span>مختاراتك الخاصة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-forest">
              العقارات المحفوظة في المفضلة
            </h1>
            <p className="text-sm text-charcoal-600 mt-1">
              قائمتك المنتقاة من العقارات للمقارنة السريعة ومتابعة الأسعار والتحديثات.
            </p>
          </div>

          {favoriteProperties.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إفراغ قائمة المفضلة</span>
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand/30 shadow-card max-w-lg mx-auto space-y-4 my-12">
            <div className="w-16 h-16 rounded-2xl bg-ivory text-red-400 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-forest">
              لم تحفظ أي عقار في المفضلة حتى الآن
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
              اضغط على أيقونة القلب الموجودة في بطاقة أي عقار أثناء التصفح لتتمكن من الرجوع إليه ومقارنته في أي وقت.
            </p>
            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors shadow-sm"
              >
                <span>تصفح كتالوج العقارات</span>
                <ArrowLeft className="w-4 h-4 text-sand" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
