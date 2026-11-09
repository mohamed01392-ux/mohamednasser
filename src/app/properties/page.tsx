import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  SlidersHorizontal,
  Building,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearchFilter from "@/components/properties/PropertySearchFilter";
import { getProperties, PropertyFilterParams } from "@/lib/services/properties";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "عقارات فاخرة للبيع وللإيجار في مصر",
  description:
    "تصفح مئات العقارات الفاخرة الموثوقة في التجمع الخامس، الشيخ زايد، العاصمة الإدارية، الساحل الشمالي، والجونة. فيلات، بنتهاوس، وشقق فندقية بأسعار وتسهيلات متنوعة.",
};

interface PropertiesPageProps {
  searchParams: {
    purpose?: string;
    property_type?: string;
    governorate?: string;
    district?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    minArea?: string;
    maxArea?: string;
    sort?: string;
    page?: string;
  };
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const limit = 9;

  const filterParams: PropertyFilterParams = {
    purpose: searchParams.purpose,
    property_type: searchParams.property_type,
    governorate: searchParams.governorate,
    district: searchParams.district,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms
      ? Number(searchParams.bathrooms)
      : undefined,
    minArea: searchParams.minArea ? Number(searchParams.minArea) : undefined,
    maxArea: searchParams.maxArea ? Number(searchParams.maxArea) : undefined,
    sort: searchParams.sort || "newest",
    page,
    limit,
    status: "published",
  };

  const { properties, total, totalPages } = await getProperties(filterParams);

  // Helper to create page URLs preserving filters
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    params.set("page", targetPage.toString());
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2 border-b border-sand/30 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sand uppercase tracking-wider">
            <span>كتالوج العقارات المختارة</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-forest">
                استكشف أرقى العقارات في مصر
              </h1>
              <p className="text-sm text-charcoal-600 mt-1">
                تصفح تشكيلة معتمدة من الوحدات السكنية والتجارية المفحوصة قانونياً بأعلى المعايير.
              </p>
            </div>
            <div className="text-sm font-semibold text-charcoal-600 bg-white px-4 py-2 rounded-xl border border-sand/30 self-start md:self-auto shadow-sm">
              تم العثور على{" "}
              <span className="text-forest font-bold">{total}</span> عقار متاح
            </div>
          </div>
        </div>

        {/* Filter Bar Component */}
        <Suspense fallback={<div className="h-40 bg-white rounded-2xl animate-pulse" />}>
          <PropertySearchFilter />
        </Suspense>

        {/* Listings Grid or Empty State */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand/30 shadow-card max-w-2xl mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-ivory text-sand mx-auto flex items-center justify-center">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-forest">
              لم نجد عقارات مطابقة لمعايير البحث الحالية
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              جرّب تخفيف قيود البحث أو تغيير النطاق السعري، أو تواصل مع مستشارينا لتوفير طلبك بصورة خاصة.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-sand" />
                <span>إعادة ضبط كافة الفلاتر</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-sand/40 text-charcoal-800 text-xs font-semibold hover:bg-ivory transition-colors"
              >
                <span>طلب استشارة خاصة</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={createPageUrl(page - 1)}
                className="px-4 py-2 rounded-xl bg-white border border-sand/30 text-xs font-semibold text-charcoal-700 hover:bg-ivory transition-colors shadow-sm"
              >
                الصفحة السابقة
              </Link>
            )}

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={createPageUrl(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-colors ${
                    p === page
                      ? "bg-forest text-ivory shadow-sm"
                      : "bg-white border border-sand/30 text-charcoal-700 hover:bg-ivory"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {page < totalPages && (
              <Link
                href={createPageUrl(page + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-sand/30 text-xs font-semibold text-charcoal-700 hover:bg-ivory transition-colors shadow-sm"
              >
                الصفحة التالية
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
