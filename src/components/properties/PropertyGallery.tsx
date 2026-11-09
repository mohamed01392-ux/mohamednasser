"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Camera,
} from "lucide-react";
import { PropertyImage } from "@/types/database";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyGallery({
  images = [],
  title,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: "fallback-1",
            property_id: "0",
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
            is_primary: true,
            display_order: 1,
            created_at: new Date().toISOString(),
          },
        ];

  const current = displayImages[currentIndex] || displayImages[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image Banner */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-charcoal-100 shadow-luxury group">
        <Image
          src={current.url}
          alt={`${title} - صورة ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal/80 text-ivory text-xs font-medium backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-sand" />
          <span>
            {currentIndex + 1} / {displayImages.length}
          </span>
        </div>

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 left-4 z-10 p-2.5 rounded-xl bg-charcoal/80 hover:bg-forest text-ivory text-xs font-medium backdrop-blur-md transition-colors"
          title="عرض ملء الشاشة"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handleNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-charcoal-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md shadow-md z-10"
              aria-label="الصورة السابقة"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-charcoal-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md shadow-md z-10"
              aria-label="الصورة التالية"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[16/10] w-24 sm:w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? "border-forest ring-2 ring-forest/30 scale-95"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`صورة مصغرة ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 left-5 p-3 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-ivory z-50 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[85vh]">
            <Image
              src={current.url}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-ivory flex items-center justify-center transition-colors"
                aria-label="التالي"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-ivory flex items-center justify-center transition-colors"
                aria-label="السابق"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sand text-sm font-medium">
            {currentIndex + 1} من أصل {displayImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
