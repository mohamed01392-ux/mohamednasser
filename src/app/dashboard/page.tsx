"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Building,
  Heart,
  MessageSquare,
  PlusCircle,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";
import { BRAND, PROPERTY_TYPES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { Property, Profile, Inquiry } from "@/types/database";
import { MOCK_PROPERTIES } from "@/data/mock-properties";

export default function UserDashboard() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [activeTab, setActiveTab] = useState<
    "listings" | "favorites" | "inquiries" | "profile"
  >("listings");

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form Edit state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);

      if (configured) {
        try {
          const supabase = createClient();
          const {
            data: { user: currentUser },
          } = await supabase.auth.getUser();

          if (!currentUser) {
            router.push("/auth/login?redirectTo=/dashboard");
            return;
          }

          setUser(currentUser);

          // 1. Fetch Profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (profileData) {
            setProfile(profileData);
            setProfileForm({
              full_name: profileData.full_name || "",
              phone: profileData.phone || "",
            });
          }

          // 2. Fetch User Properties
          const { data: propsData } = await supabase
            .from("properties")
            .select("*, images:property_images(*)")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });

          if (propsData) {
            setUserListings(propsData);
          }

          // 3. Fetch User Favorites
          const { data: favsData } = await supabase
            .from("favorites")
            .select("*, property:properties(*, images:property_images(*))")
            .eq("user_id", currentUser.id);

          if (favsData) {
            const favProps = favsData
              .map((f: any) => f.property)
              .filter(Boolean);
            setFavorites(favProps);
          }

          // 4. Fetch User Inquiries
          const { data: inqData } = await supabase
            .from("inquiries")
            .select("*, property:properties(title)")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });

          if (inqData) {
            setInquiries(inqData);
          }
        } catch (err) {
          console.warn("Supabase load error:", err);
        }
      } else {
        // Standalone demonstration data mode
        setUser({
          id: "demo-user",
          email: "vip.client@mawaa-realestate.eg",
        });
        setProfile({
          id: "demo-user",
          full_name: "م. كريم عبد الرحمن",
          phone: "+20 100 123 4567",
          avatar_url: null,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setProfileForm({
          full_name: "م. كريم عبد الرحمن",
          phone: "01001234567",
        });

        // Use mock listings
        setUserListings([
          {
            ...MOCK_PROPERTIES[0],
            status: "published",
          },
          {
            ...MOCK_PROPERTIES[4],
            title: "دوبلكس فاخر قيد المراجعة والاعتماد — التجمع الخامس",
            status: "pending",
          },
        ]);

        // Load local favorites
        try {
          const saved = localStorage.getItem("mawaa_favorites");
          if (saved) {
            const ids: string[] = JSON.parse(saved);
            const favProps = MOCK_PROPERTIES.filter((p) => ids.includes(p.id));
            setFavorites(favProps);
          }
        } catch {
          // ignore
        }

        // Mock inquiries
        setInquiries([
          {
            id: "inq-1",
            property_id: MOCK_PROPERTIES[0].id,
            user_id: "demo-user",
            name: "م. كريم عبد الرحمن",
            email: "vip.client@mawaa-realestate.eg",
            phone: "01001234567",
            type: "viewing",
            preferred_date: "2026-11-15",
            preferred_time: "12:00 م - 02:00 م",
            message: "أود تأكيد موعد المعاينة الخاصة للفيلا يوم الأحد القادم.",
            status: "contacted",
            created_at: "2026-11-06T10:00:00Z",
            property: MOCK_PROPERTIES[0],
          },
        ]);
      }

      setLoading(false);
    }

    loadUserData();
  }, [configured, router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    try {
      if (configured && user) {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: profileForm.full_name,
            phone: profileForm.phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (!error) {
          setProfileSuccess(true);
        }
      } else {
        setProfileSuccess(true);
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = async () => {
    if (configured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>منشور معتمد</span>
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>قيد المراجعة الفنية</span>
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>مرفوض (يتطلب تعديل)</span>
          </span>
        );
      case "archived":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-charcoal-100 text-charcoal-700 flex items-center gap-1.5 w-fit">
            <Archive className="w-3.5 h-3.5 text-charcoal-500" />
            <span>مؤرشف</span>
          </span>
        );
      default:
        return null;
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
    <div className="min-h-screen py-10 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Supabase connection note if in scaffolding mode */}
        {!configured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">وضع المحاكاة والجاهزية (Demo Scaffolding)</span>
              <p className="leading-relaxed">
                لوحة التحكم تعمل حالياً بنموذج العرض التجريبي المتكامل. عند إضافة مفاتيح Supabase في <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> وتشغيل الميجريشن، سيتم استرداد كافة البيانات الحية من قاعدة بيانات PostgreSQL عبر Supabase SSR فوراً.
              </p>
            </div>
          </div>
        )}

        {/* User Welcome Banner */}
        <div className="bg-forest text-ivory rounded-3xl p-6 sm:p-10 shadow-card border border-sand/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sand text-forest flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0">
              {profileForm.full_name ? profileForm.full_name[0] : "م"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-sand font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sand" />
                <span>حساب موثق لدى مأوى العقارية</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                أهلاً بك، {profileForm.full_name || "مستخدم مأوى"}
              </h1>
              <p className="text-xs text-sand-100/80 mt-1">
                {user?.email} • {profileForm.phone || "لم يسجل الهاتف بعد"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/properties/add"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sand hover:bg-sand-600 text-white text-xs font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة عقار جديد</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sand/30 hover:bg-forest-800 text-ivory text-xs font-semibold transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4 text-sand" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">عقاراتي المعروضة</span>
              <Building className="w-4 h-4 text-forest" />
            </div>
            <div className="text-2xl font-black text-forest">
              {userListings.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">قيد المراجعة</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {userListings.filter((p) => p.status === "pending").length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">المفضلة المحفوظة</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black text-charcoal-900">
              {favorites.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sand/20 shadow-card">
            <div className="flex items-center justify-between text-charcoal-400 mb-2">
              <span className="text-xs font-bold text-charcoal-600">طلبات المعاينة</span>
              <MessageSquare className="w-4 h-4 text-sand" />
            </div>
            <div className="text-2xl font-black text-charcoal-900">
              {inquiries.length}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-sand/30 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "listings"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>عقاراتي المعروضة ({userListings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "favorites"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>العقارات المفضلة ({favorites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "inquiries"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>سجل المعاينات والاستفسارات ({inquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "border-forest text-forest bg-white shadow-sm"
                : "border-transparent text-charcoal-600 hover:text-forest"
            }`}
          >
            <User className="w-4 h-4" />
            <span>الملف الشخصي والإعدادات</span>
          </button>
        </div>

        {/* Tab 1: MY LISTINGS */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {userListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand/30 shadow-card max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-ivory text-forest mx-auto flex items-center justify-center">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-forest">لم تقم بإضافة عقارات بعد</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  هل تمتلك فيلا أو بنتهاوس أو شقة فاخرة ترغب في عرضها للبيع أو الإيجار لجمهور النخبة؟ أضف عقارك الآن.
                </p>
                <Link
                  href="/dashboard/properties/add"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-sand" />
                  <span>إضافة عقار جديد</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userListings.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-sand/30 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-charcoal-100 shrink-0">
                        <Image
                          src={
                            prop.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(prop.status)}
                          <span className="text-xs text-charcoal-500 font-medium">
                            {prop.district}، {prop.governorate}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-charcoal-900 hover:text-forest line-clamp-1">
                          <Link href={`/properties/${prop.slug || prop.id}`}>
                            {prop.title}
                          </Link>
                        </h4>
                        <div className="text-sm font-bold text-forest">
                          {formatPrice(prop.price)}
                        </div>
                        {prop.rejection_reason && (
                          <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mt-1">
                            ملاحظة الفحص: {prop.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link
                        href={`/dashboard/properties/${prop.id}/edit`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand/30 hover:border-forest text-charcoal-800 text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-sand" />
                        <span>تعديل</span>
                      </Link>

                      <Link
                        href={`/properties/${prop.slug || prop.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory hover:bg-forest hover:text-ivory text-charcoal-800 text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>معاينة</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: FAVORITES */}
        {activeTab === "favorites" && (
          <div>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand/30 shadow-card max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-ivory text-red-400 mx-auto flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-forest">قائمة المفضلة فارغة</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  أثناء تصفحك للعقارات، يمكنك الضغط على أيقونة القلب في بطاقة العقار لحفظه هنا ومقارنته لاحقاً.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  <span>استكشف العقارات الآن</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-white rounded-2xl p-4 border border-sand/30 shadow-card space-y-3"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-charcoal-100">
                      <Image
                        src={
                          fav.images?.[0]?.url ||
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={fav.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-charcoal-400">
                        {fav.district}، {fav.governorate}
                      </span>
                      <h4 className="font-bold text-sm text-charcoal-900 line-clamp-1">
                        <Link href={`/properties/${fav.slug || fav.id}`}>
                          {fav.title}
                        </Link>
                      </h4>
                      <div className="text-sm font-bold text-forest">
                        {formatPrice(fav.price)}
                      </div>
                    </div>
                    <Link
                      href={`/properties/${fav.slug || fav.id}`}
                      className="w-full py-2 rounded-xl bg-forest text-ivory text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-forest-800 transition-colors"
                    >
                      <span>عرض تفاصيل العقار</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand/30 shadow-card max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-ivory text-sand mx-auto flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-forest">لا توجد طلبات معاينة مسجلة</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  عندما ترسل استفساراً أو تطلب معاينة خاصة لأي عقار معروض، سيظهر سجلك ومتابعة الحالة هنا.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest text-ivory text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  <span>تصفح العقارات المتاحة</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl p-5 border border-sand/30 shadow-card space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand/20 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest text-ivory">
                          {inq.type === "viewing" ? "طلب معاينة خاصة" : "استفسار"}
                        </span>
                        <span className="text-xs text-charcoal-500 font-medium">
                          {new Date(inq.created_at).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          inq.status === "contacted"
                            ? "bg-emerald-100 text-emerald-800"
                            : inq.status === "closed"
                            ? "bg-charcoal-100 text-charcoal-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inq.status === "contacted"
                          ? "تم التواصل من المستشار"
                          : inq.status === "closed"
                          ? "مكتمل"
                          : "طلب جديد قيد التنسيق"}
                      </span>
                    </div>

                    <p className="text-sm text-charcoal-800 leading-relaxed">
                      &ldquo;{inq.message}&rdquo;
                    </p>

                    {inq.preferred_date && (
                      <div className="text-xs text-forest font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sand" />
                        <span>
                          الموعد المفضل: {inq.preferred_date} ({inq.preferred_time})
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand/30 shadow-card max-w-xl mx-auto space-y-6">
            <div className="space-y-1 border-b border-sand/20 pb-4">
              <h3 className="text-lg font-bold text-forest">بيانات الملف الشخصي</h3>
              <p className="text-xs text-charcoal-500">
                قم بتحديث اسمك ورقم هاتفك المستخدم في التواصل بشأن المعاينات
              </p>
            </div>

            {profileSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ تعديلات الملف الشخصي بنجاح.</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-700">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, full_name: e.target.value })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-700">
                  رقم الهاتف (واتساب)
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  dir="ltr"
                  className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-ivory/50 text-sm text-charcoal-900 text-right focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="space-y-1.5 opacity-60">
                <label className="text-xs font-semibold text-charcoal-700">
                  البريد الإلكتروني (غير قابل للتعديل)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  dir="ltr"
                  className="w-full h-11 px-3.5 rounded-xl border border-sand/30 bg-charcoal-50 text-sm text-charcoal-600 text-right"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full h-11 rounded-xl bg-forest hover:bg-forest-800 text-ivory font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {profileSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-sand" />
                    <span>حفظ التعديلات</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
