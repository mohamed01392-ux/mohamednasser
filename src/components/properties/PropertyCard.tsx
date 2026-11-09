"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Property } from "@/types/database";
import { formatPrice, formatArea } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants";

interface PropertyCardProps {
  property: Property;
  featuredBadge?: boolean;
}

export default function PropertyCard({
  property,
  featuredBadge = false,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mawaa_favorites");
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsFavorite(list.includes(property.id));
      }
    } catch {
      // ignore
    }
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = localStorage.getItem("mawaa_favorites");
      let list: string[] = saved ? JSON.parse(saved) : [];

      if (list.includes(property.id)) {
        list = list.filter((id) => id !== property.id);
        setIsFavorite(false);
      } else {
        list.push(property.id);
        setIsFavorite(true);
      }

      localStorage.setItem("mawaa_favorites", JSON.stringify(list));
      window.dispatchEvent(new Event("favorites-updated"));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const primaryImage =
    property.images?.find((img) => img.is_primary)?.url ||
    property.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.property_type)?.label ||
    property.property_type;

  const purposeLabel = property.purpose === "sale" ? "للبيع" : "للإيجار";

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-sand/20 hover:border-sand/60 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-100">
        <Link href={`/properties/${property.slug || property.id}`}>
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
              property.purpose === "sale"
                ? "bg-forest text-ivory"
                : "bg-sand text-white"
            }`}
          >
            {purposeLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-charcoal/70 text-ivory backdrop-blur-md">
            {typeLabel}
          </span>
        </div>

        {/* Left Actions: Favorite & Demo Marker */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-sm ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 hover:bg-white text-charcoal-700 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFavorite ? "fill-current scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Tag (Demo Note) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/40 text-sand-100 backdrop-blur-sm">
            نموذج استعراضي
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-sand shrink-0" />
            <span className="truncate">
              {property.compound ? `${property.compound}، ` : ""}
              {property.district}، {property.governorate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-charcoal-900 group-hover:text-forest transition-colors line-clamp-2 leading-snug">
            <Link href={`/properties/${property.slug || property.id}`}>
              {property.title}
            </Link>
          </h3>
        </div>

        {/* Specs Row */}
        <div className="pt-3 border-t border-sand/15 grid grid-cols-3 gap-2 text-xs text-charcoal-600 font-medium">
          <div className="flex items-center gap-1.5" title="غرف النوم">
            <Bed className="w-4 h-4 text-forest-500 shrink-0" />
            <span>{property.bedrooms} غرف</span>
          </div>
          <div className="flex items-center gap-1.5" title="الحمامات">
            <Bath className="w-4 h-4 text-forest-500 shrink-0" />
            <span>{property.bathrooms} حمام</span>
          </div>
          <div className="flex items-center gap-1.5" title="المساحة">
            <Maximize2 className="w-4 h-4 text-forest-500 shrink-0" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>

        {/* Footer: Price & View CTA */}
        <div className="pt-3 border-t border-sand/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-charcoal-400 font-medium">
              {property.purpose === "sale" ? "السعر الإجمالي" : "الإيجار الشهري"}
            </span>
            <span className="text-base sm:text-lg font-bold text-forest">
              {formatPrice(property.price)}
            </span>
          </div>

          <Link
            href={`/properties/${property.slug || property.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-sand hover:text-sand-700 transition-colors"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
