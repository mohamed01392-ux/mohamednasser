"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { Property, Profile, Inquiry } from "@/types/database";
import { MOCK_PROPERTIES } from "@/data/mock-properties";

export default function AdminDashboardPage() {
  const configured = isSupabaseConfigured();

  const [activeTab, setActiveTab] = useState<
    "moderation" | "inquiries" | "users"
  >("moderation");

  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingListings: 0,
    publishedListings: 0,
    totalInquiries: 0,
  });

  // Rejection modal state
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    propertyId: string | null;
    reason: string;
  }>({
    open: false,
    propertyId: null,
    reason: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (configured) {
        try {
          const supabase = createClient();

          // 1. Fetch properties
          const { data: propsData } = await supabase
            .from("properties")
            .select("*, images:property_images(*)")
            .order("created_at", { ascending: false });

          if (propsData) {
            setProperties(propsData);
          }

          // 2. Fetch Inquiries
          const { data: inqData } = await supabase
            .from("inquiries")
            .select("*, property:properties(title)")
            .order("created_at", { ascending: false });

          if (inqData) {
            setInquiries(inqData);
          }

          // 3. Fetch Users
          const { data: usersData } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

          if (usersData) {
            setUsers(usersData);
          }

          // 4. Calculate actual metrics from DB records
          const totalUsers = usersData?.length || 0;
          const totalListings = propsData?.length || 0;
          const pendingListings =
            propsData?.filter((p) => p.status === "pending").length || 0;
          const publishedListings =
            propsData?.filter((p) => p.status === "published").length || 0;
          const totalInquiries = inqData?.length || 0;

          setMetrics({
            totalUsers,
            totalListings,
            pendingListings,
            publishedListings,
            totalInquiries,
          });
        } catch (err) {
          console.warn("Admin data load error:", err);
        }
      } else {
        // Standalone showcase demonstration data
        const mockProps = [
          ...MOCK_PROPERTIES,
          {
            ...MOCK_PROPERTIES[0],
            id: "pending-demo-1",
            title: "فيلا مستقلة فاخرة قيد الاعتماد — كمبوند ميفيدا التجمع الخامس",
            slug: "villa-mivida-pending-review-demo",
            status: "pending" as const,
          },
          {
            ...MOCK_PROPERTIES[1],
            id: "pending-demo-2",
            title: "بنتهاوس راقٍ بفيو بانورامي قيد المراجعة الفنية — الشيخ زايد",
            slug: "penthouse-zayed-pending-review-demo",
            status: "pending" as const,
          },
        ];

        setProperties(mockProps);

        const mockInquiries: Inquiry[] = [
          {
            id: "inq-1",
            property_id: MOCK_PROPERTIES[0].id,
            user_id: null,
            name: "د. هاني السعدني",
            email: "hany.saadani@domain.eg",
            phone: "01005544332",
            type: "viewing",
            preferred_date: "2026-11-12",
            preferred_time: "12:00 م - 02:00 م",
            message: "أود ترتيب موعد معاينة خاصة لعائلتي خلال عطلة نهاية الأسبوع.",
            status: "new",
            created_at: "2026-11-07T11:20:00Z",
            property: MOCK_PROPERTIES[0],
          },
          {
            id: "inq-2",
            property_id: MOCK_PROPERTIES[1].id,
            user_id: null,
            name: "م. نادية المنياوي",
            email: "nadia.meniawy@domain.eg",
            phone: "01223344556",
            type: "inquiry",
            preferred_date: null,
            preferred_time: null,
            message: "هل متاح خطة سداد على 4 سنوات للبنتهاوس المعروض في بيفرلي هيلز؟",
            status: "contacted",
            created_at: "2026-11-06T15:45:00Z",
            property: MOCK_PROPERTIES[1],
          },
        ];

        setInquiries(mockInquiries);

        const mockUsers: Profile[] = [
          {
            id: "u-1",
            full_name: "م. كريم عبد الرحمن",
            phone: "01001234567",
            avatar_url: null,
            role: "admin",
            created_at: "2026-10-15T09:00:00Z",
            updated_at: "2026-10-15T09:00:00Z",
          },
          {
            id: "u-2",
            full_name: "أحمد عبد الله",
            phone: "01112223334",
            avatar_url: null,
            role: "user",
            created_at: "2026-11-01T12:00:00Z",
            updated_at: "2026-11-01T12:00:00Z",
          },
          {
            id: "u-3",
            full_name: "سارة الجوهري",
            phone: "01556677889",
            avatar_url: null,
            role: "agent",
            created_at: "2026-11-03T14:30:00Z",
            updated_at: "2026-11-03T14:30:00Z",
          },
        ];

        setUsers(mockUsers);

        setMetrics({
          totalUsers: 148,
          totalListings: mockProps.length,
          pendingListings: mockProps.filter((p) => p.status === "pending").length,
          publishedListings: mockProps.filter((p) => p.status === "published").length,
          totalInquiries: 34,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [configured]);

  const updatePropertyStatus = async (
    propertyId: string,
    newStatus: "published" | "rejected" | "archived",
    reason?: string
  ) => {
    if (configured) {
      try {
        const supabase = createClient();
        await supabase
          .from("properties")
          .update({
            status: newStatus,
            rejection_reason: reason || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", propertyId);
      } catch (err) {
        console.warn("Status update error:", err);
      }
    }

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              status: newStatus,
              rejection_reason: reason || null,
            }
          : p
      )
    );

    setMetrics((prev) => ({
      ...prev,
      pendingListings: properties.filter(
        (p) => (p.id === propertyId ? newStatus : p.status) === "pending"
      ).length,
      publishedListings: properties.filter(
        (p) => (p.id === propertyId ? newStatus : p.status) === "published"
      ).length,
    }));
  };

  const updateInquiryStatus = async (
    inquiryId: string,
    newStatus: "contacted" | "closed" | "new"
  ) => {
    if (configured) {
      try {
        const supabase = createClient();
        await supabase
          .from("inquiries")
          .update({ status: newStatus })
          .eq("id", inquiryId);
      } catch (err) {
        console.warn("Inquiry update error:", err);
      }
    }

    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, status: newStatus } : inq
      )
    );
  };

  const filteredProperties =
    statusFilter === "all"
      ? properties
      : properties.filter((p) => p.status === statusFilter);

  return (
    <div className="min-h-screen py-10 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-forest text-ivory rounded-3xl p-6 sm:p-8 shadow-card border border-sand/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-sand font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-sand" />
              <span>بوابة الإدارة المركزية والاعتماد</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              لوحة تحكم إدارة مأوى العقارية
            </h1>
            <p className="text-xs text-sand-100/80">
              إشراف وتدقيق الإعلانات، متابعة طلبات المعاينة، وإدارة حسابات المستخدمين والوسطاء.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-forest-800 border border-sand/30 text-sand text-xs font-bold">
              صلاحيات المدير الكاملة (Admin Mode)
            </span>
          </div>
        </div>

        {/* Real Metrics Cards (Section 10) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">المستخدمين المسجلين</span>
              <Users className="w-4 h-4 text-forest" />
            </div>
            <div className="text-2xl font-black text-forest">
              {metrics.totalUsers}
            </div>
            <div className="text-[11px] text-charcoal-400 mt-1">حسابات نشطة</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">إجمالي العقارات</span>
              <Building2 className="w-4 h-4 text-forest" />
            </div>
            <div className="text-2xl font-black text-charcoal-900">
              {metrics.totalListings}
            </div>
            <div className="text-[11px] text-charcoal-400 mt-1">في قاعدة البيانات</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-card">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-bold text-amber-800">قيد المراجعة</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {metrics.pendingListings}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">تتطلب اعتماداً فورياً</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-card">
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <span className="text-xs font-bold text-emerald-800">العقارات المنشورة</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {metrics.publishedListings}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">معتمدة بالكتالوج</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">طلبات المعاينة</span>
              <MessageSquare className="w-4 h-4 text-sand" />
            </div>
            <div className="text-2xl font-black text-charcoal-900">
              {metrics.totalInquiries}
            </div>
            <div className="text-[11px] text-charcoal-400 mt-1">واردة من العملاء</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-sand/30 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "moderation"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>إشراف واعتماد العقارات ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "inquiries"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>طلبات المعاينة والاستفسارات ({inquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "users"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة المستخدمين ({users.length})</span>
          </button>
        </div>

        {/* Tab 1: PROPERTY MODERATION */}
        {activeTab === "moderation" && (
          <div className="space-y-6">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { value: "all", label: "كافة العقارات" },
                { value: "pending", label: "قيد المراجعة الفنية (Pending)" },
                { value: "published", label: "منشورة ومعتمدة (Published)" },
                { value: "rejected", label: "مرفوضة (Rejected)" },
                { value: "archived", label: "مؤرشفة (Archived)" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === filter.value
                      ? "bg-forest text-ivory shadow-sm"
                      : "bg-white text-charcoal-700 border border-sand/30 hover:bg-ivory"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Properties Moderation Table */}
            <div className="bg-white rounded-2xl border border-sand/30 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-ivory/80 text-charcoal-700 font-bold border-b border-sand/20">
                    <tr>
                      <th className="p-4">العقار</th>
                      <th className="p-4">الموقع</th>
                      <th className="p-4">السعر المطلوب</th>
                      <th className="p-4">الحالة الحالية</th>
                      <th className="p-4 text-center">الإجراءات والاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/15 font-medium text-charcoal-800">
                    {filteredProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-ivory/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-charcoal-100 shrink-0">
                              <Image
                                src={
                                  prop.images?.[0]?.url ||
                                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                                }
                                alt={prop.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="font-bold text-sm text-charcoal-900 line-clamp-1 max-w-xs">
                                {prop.title}
                              </div>
                              <span className="text-[11px] text-charcoal-400">
                                الرمز: #{prop.id.slice(0, 8)} • {prop.purpose === "sale" ? "بيع" : "إيجار"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {prop.district}، {prop.governorate}
                        </td>

                        <td className="p-4 whitespace-nowrap font-bold text-forest">
                          {formatPrice(prop.price)}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {prop.status === "published" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              منشور معتمد
                            </span>
                          )}
                          {prop.status === "pending" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                              قيد المراجعة
                            </span>
                          )}
                          {prop.status === "rejected" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                              مرفوض
                            </span>
                          )}
                          {prop.status === "archived" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-charcoal-100 text-charcoal-700">
                              مؤرشف
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Approve / Publish */}
                            {prop.status !== "published" && (
                              <button
                                type="button"
                                onClick={() =>
                                  updatePropertyStatus(prop.id, "published")
                                }
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-colors"
                                title="موافقة واعتماد النشر"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>موافقة ونشر</span>
                              </button>
                            )}

                            {/* Reject */}
                            {prop.status !== "rejected" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRejectModal({
                                    open: true,
                                    propertyId: prop.id,
                                    reason: "",
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1 transition-colors"
                                title="رفض الإعلان"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>رفض</span>
                              </button>
                            )}

                            {/* View Details */}
                            <Link
                              href={`/properties/${prop.slug || prop.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-ivory text-charcoal-700 hover:bg-sand/20 transition-colors"
                              title="معاينة الصفحة العامة"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: INQUIRIES MANAGEMENT */}
        {activeTab === "inquiries" && (
          <div className="bg-white rounded-2xl border border-sand/30 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-ivory/80 text-charcoal-700 font-bold border-b border-sand/20">
                  <tr>
                    <th className="p-4">العميل</th>
                    <th className="p-4">رقم الهاتف / البريد</th>
                    <th className="p-4">النوع والموعد</th>
                    <th className="p-4">الرسالة</th>
                    <th className="p-4">حالة المتابعة</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/15 font-medium text-charcoal-800">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-ivory/40 transition-colors">
                      <td className="p-4 whitespace-nowrap font-bold text-charcoal-900">
                        {inq.name}
                      </td>

                      <td className="p-4 whitespace-nowrap text-left" dir="ltr">
                        <div>{inq.phone}</div>
                        <div className="text-[11px] text-charcoal-400">{inq.email}</div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="font-bold text-forest block">
                          {inq.type === "viewing" ? "معاينة خاصة" : "استفسار"}
                        </span>
                        {inq.preferred_date && (
                          <span className="text-[11px] text-charcoal-500">
                            {inq.preferred_date}
                          </span>
                        )}
                      </td>

                      <td className="p-4 max-w-xs truncate" title={inq.message}>
                        {inq.message}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            inq.status === "contacted"
                              ? "bg-emerald-100 text-emerald-800"
                              : inq.status === "closed"
                              ? "bg-charcoal-100 text-charcoal-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inq.status === "contacted"
                            ? "تم التواصل"
                            : inq.status === "closed"
                            ? "مغلق"
                            : "جديد"}
                        </span>
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            updateInquiryStatus(
                              inq.id,
                              inq.status === "contacted" ? "closed" : "contacted"
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
                        >
                          {inq.status === "contacted"
                            ? "إغلاق الطلب"
                            : "تحديث: تم التواصل"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-sand/30 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-ivory/80 text-charcoal-700 font-bold border-b border-sand/20">
                  <tr>
                    <th className="p-4">اسم المستخدم</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">الصلاحية (Role)</th>
                    <th className="p-4">تاريخ الانضمام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/15 font-medium text-charcoal-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-ivory/40 transition-colors">
                      <td className="p-4 whitespace-nowrap font-bold text-charcoal-900">
                        {u.full_name}
                      </td>

                      <td className="p-4 whitespace-nowrap" dir="ltr">
                        {u.phone || "—"}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "agent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-charcoal-100 text-charcoal-700"
                          }`}
                        >
                          {u.role === "admin"
                            ? "مسؤول نظام (Admin)"
                            : u.role === "agent"
                            ? "وسيط معتمد (Agent)"
                            : "مستخدم عادي (User)"}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap text-charcoal-500">
                        {new Date(u.created_at).toLocaleDateString("ar-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-luxury animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-sand/20 pb-3">
                <h3 className="font-bold text-base text-charcoal-900">
                  سبب رفض إدراج العقار
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setRejectModal({ open: false, propertyId: null, reason: "" })
                  }
                  className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed">
                يرجى تدوين ملاحظة التدقيق الفني أو القانوني التي ستظهر لمالك العقار لإجراء التعديل المطلوب.
              </p>

              <textarea
                rows={3}
                placeholder="مثال: يرجى إرفاق صور واضحة للواجهة والحديقة الخاصة والتأكد من صحة رقم الترخيص..."
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal({ ...rejectModal, reason: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-sand/30 bg-ivory/50 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setRejectModal({ open: false, propertyId: null, reason: "" })
                  }
                  className="px-4 py-2 rounded-xl border border-sand/30 text-charcoal-700 text-xs font-semibold hover:bg-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rejectModal.propertyId) {
                      updatePropertyStatus(
                        rejectModal.propertyId,
                        "rejected",
                        rejectModal.reason || "عدم استيفاء بعض الشروط الفنية"
                      );
                    }
                    setRejectModal({ open: false, propertyId: null, reason: "" });
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                >
                  تأكيد الرفض
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
