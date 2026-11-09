"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  Building,
  MapPin,
  CircleDollarSign,
} from "lucide-react";
import {
  PROPERTY_TYPES,
  PURPOSES,
  GOVERNORATES,
  SORT_OPTIONS,
} from "@/lib/constants";

interface FilterState {
  purpose: string;
  property_type: string;
  governorate: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
  sort: string;
}

export default function PropertySearchFilter({
  variant = "horizontal",
}: {
  variant?: "horizontal" | "sidebar";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    purpose: searchParams.get("purpose") || "all",
    property_type: searchParams.get("property_type") || "all",
    governorate: searchParams.get("governorate") || "all",
    district: searchParams.get("district") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    sort: searchParams.get("sort") || "newest",
  });

  // Sync state with URL if user navigates with back/forward
  useEffect(() => {
    setFilters({
      purpose: searchParams.get("purpose") || "all",
      property_type: searchParams.get("property_type") || "all",
      governorate: searchParams.get("governorate") || "all",
      district: searchParams.get("district") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      minArea: searchParams.get("minArea") || "",
      maxArea: searchParams.get("maxArea") || "",
      sort: searchParams.get("sort") || "newest",
    });
  }, [searchParams]);

  const activeGovernorateObj = GOVERNORATES.find(
    (g) => g.name === filters.governorate
  );

  const handleApply = (newFilters: FilterState = filters) => {
    const params = new URLSearchParams();

    if (newFilters.purpose && newFilters.purpose !== "all")
      params.set("purpose", newFilters.purpose);
    if (newFilters.property_type && newFilters.property_type !== "all")
      params.set("property_type", newFilters.property_type);
    if (newFilters.governorate && newFilters.governorate !== "all")
      params.set("governorate", newFilters.governorate);
    if (newFilters.district && newFilters.district !== "all")
      params.set("district", newFilters.district);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.bedrooms) params.set("bedrooms", newFilters.bedrooms);
    if (newFilters.bathrooms) params.set("bathrooms", newFilters.bathrooms);
    if (newFilters.minArea) params.set("minArea", newFilters.minArea);
    if (newFilters.maxArea) params.set("maxArea", newFilters.maxArea);
    if (newFilters.sort && newFilters.sort !== "newest")
      params.set("sort", newFilters.sort);

    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      purpose: "all",
      property_type: "all",
      governorate: "all",
      district: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
      sort: "newest",
    };
    setFilters(resetState);
    router.push("/properties");
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-sand/30">
      {/* Purpose Tabs: للبيع / للإيجار / الكل */}
      <div className="flex items-center gap-2 pb-4 border-b border-sand/20 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            const next = { ...filters, purpose: "all" };
            setFilters(next);
            handleApply(next);
          }}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            filters.purpose === "all"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-ivory text-charcoal-700 hover:bg-sand/20"
          }`}
        >
          الكل
        </button>
        <button
          type="button"
          onClick={() => {
            const next = { ...filters, purpose: "sale" };
            setFilters(next);
            handleApply(next);
          }}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            filters.purpose === "sale"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-ivory text-charcoal-700 hover:bg-sand/20"
          }`}
        >
          عقارات للبيع
        </button>
        <button
          type="button"
          onClick={() => {
            const next = { ...filters, purpose: "rent" };
            setFilters(next);
            handleApply(next);
          }}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            filters.purpose === "rent"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-ivory text-charcoal-700 hover:bg-sand/20"
          }`}
        >
          عقارات للإيجار
        </button>
      </div>

      {/* Main Filter Fields */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Property Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-sand" />
            <span>نوع العقار</span>
          </label>
          <select
            value={filters.property_type}
            onChange={(e) =>
              setFilters({ ...filters, property_type: e.target.value })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          >
            <option value="all">كافة أنواع العقارات</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Governorate */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sand" />
            <span>المحافظة</span>
          </label>
          <select
            value={filters.governorate}
            onChange={(e) =>
              setFilters({
                ...filters,
                governorate: e.target.value,
                district: "all",
              })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          >
            <option value="all">كافة المحافظات</option>
            {GOVERNORATES.map((gov) => (
              <option key={gov.name} value={gov.name}>
                {gov.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sand" />
            <span>الحي / المنطقة</span>
          </label>
          <select
            value={filters.district}
            disabled={filters.governorate === "all"}
            onChange={(e) =>
              setFilters({ ...filters, district: e.target.value })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest disabled:opacity-50"
          >
            <option value="all">
              {filters.governorate === "all"
                ? "اختر المحافظة أولاً"
                : "كافة الأحياء والمناطق"}
            </option>
            {activeGovernorateObj?.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sand" />
            <span>ترتيب النتائج</span>
          </label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="pt-4 mt-4 border-t border-sand/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
              <CircleDollarSign className="w-3.5 h-3.5 text-sand" />
              <span>السعر من (ج.م)</span>
            </label>
            <input
              type="number"
              placeholder="مثال: 5,000,000"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1.5">
              <CircleDollarSign className="w-3.5 h-3.5 text-sand" />
              <span>السعر إلى (ج.م)</span>
            </label>
            <input
              type="number"
              placeholder="مثال: 30,000,000"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-600">
              عدد غرف النوم (الحد الأدنى)
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) =>
                setFilters({ ...filters, bedrooms: e.target.value })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            >
              <option value="">أي عدد</option>
              <option value="1">غرفة واحدة فأكثر</option>
              <option value="2">غرفتان فأكثر</option>
              <option value="3">3 غرف فأكثر</option>
              <option value="4">4 غرف فأكثر</option>
              <option value="5">5 غرف فأكثر</option>
            </select>
          </div>

          {/* Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-600">
              المساحة تبدأ من (م²)
            </label>
            <input
              type="number"
              placeholder="مثال: 180"
              value={filters.minArea}
              onChange={(e) =>
                setFilters({ ...filters, minArea: e.target.value })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>
        </div>
      )}

      {/* Buttons Action Bar */}
      <div className="pt-5 mt-4 border-t border-sand/20 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-sand transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? "إخفاء الفلاتر المتقدمة" : "فلاتر متقدمة (السعر، المساحة، الغرف)"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sand/30 text-charcoal-700 hover:bg-ivory text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>إعادة ضبط</span>
          </button>

          <button
            type="button"
            onClick={() => handleApply()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-800 text-ivory text-xs font-bold shadow-sm transition-all hover:shadow-luxury"
          >
            <Search className="w-3.5 h-3.5 text-sand" />
            <span>تطبيق الفلترة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
