// =====================================================================
// مأوى العقارية | MAWAA REAL ESTATE
// Application Constants & Egyptian Real Estate Dictionaries
// =====================================================================

export const BRAND = {
  nameAr: "مأوى العقارية",
  nameEn: "MAWAA REAL ESTATE",
  tagline: "بيتك الأقرب لحياتك.",
  managerName: "أ. عبدالله حسين",
  managerTitle: "المدير العام والمستشار العقاري",
  description:
    "المنصة المصرية الرائدة للعقارات الفاخرة والاستثمارية بإدارة أ. عبدالله حسين. نقدم باقة منتقاة بعناية من الفيلات، البنتهاوس، والشقق الفندقية في أكثر المواقع تميزاً في مصر.",
  hotline: "01120687700",
  phone1: "01120687700",
  phone2: "01095052739",
  whatsapp1: "201120687700",
  whatsapp2: "201095052739",
  whatsapp1Url: "https://wa.me/201120687700",
  whatsapp2Url: "https://wa.me/201095052739",
  phone: "01120687700",
  whatsapp: "201120687700",
  email: "contact@mawaa-realestate.eg",
  headquarters: "القطاع الأول، التسعين الشمالي، القاهرة الجديدة، مصر",
  zayedBranch: "بجوار أركان بلازا، محور 26 يوليو، الشيخ زايد، مصر",
  workingHours: "يومياً من 10:00 صباحاً حتى 10:00 مساءً",
  sellPropertyNotice:
    "حابب تعرض عقارك وتبيعه أو تأجره لأرقى العملاء؟ تواصل مباشرة مع أ. عبدالله حسين على: 01120687700 أو 01095052739 وسنتولى التسويق والمعاينة فوراً.",
};

export const PROPERTY_TYPES = [
  { value: "apartment", label: "شقة سكنية", desc: "شقق فاخرة بتشطيبات راقية" },
  { value: "villa", label: "فيلا مستقلة", desc: "خصوصية كاملة وحديقة خاصة ومسبح" },
  { value: "penthouse", label: "بنتهاوس", desc: "إطلالات بانورامية وتراسات علوية" },
  { value: "duplex", label: "دوبلكس", desc: "مساحتين متصلتين بطابع عائلي" },
  { value: "townhouse", label: "تاون هاوس", desc: "منازل متناسقة بحدائق خاصة" },
  { value: "chalet", label: "شاليه ساحلي", desc: "وجهتك الصيفية على البحر واللاجون" },
  { value: "studio", label: "استوديو", desc: "مساحات ذكية ومواقع استراتيجية" },
  { value: "commercial", label: "تجاري وإداري", desc: "مكاتب ومقرات شركات راقية" },
  { value: "land", label: "أرض استثمارية", desc: "أراضٍ بمواقع واعدة للتطوير" },
] as const;

export const PURPOSES = [
  { value: "sale", label: "للبيع", desc: "تملك حر واستثمار طويل الأجل" },
  { value: "rent", label: "للإيجار", desc: "إيجار شهري وسنوي بمواصفات راقية" },
] as const;

export const GOVERNORATES = [
  {
    name: "القاهرة",
    districts: [
      "التجمع الخامس",
      "القاهرة الجديدة",
      "العاصمة الإدارية",
      "الزمالك",
      "المعادي",
      "مصر الجديدة",
      "مدينة نصر",
      "الشروق",
      "مدينتي",
      "المستقبل سيتي",
    ],
  },
  {
    name: "الجيزة",
    districts: [
      "الشيخ زايد",
      "6 أكتوبر",
      "الدقي",
      "المهندسين",
      "نيو زايد (التوسعات الشمالية)",
      "حدائق أكتوبر",
    ],
  },
  {
    name: "مطروح",
    districts: [
      "الساحل الشمالي",
      "رأس الحكمة",
      "سيدي عبد الرحمن",
      "العلمين الجديدة",
      "الضبعة",
    ],
  },
  {
    name: "البحر الأحمر",
    districts: ["الجونة", "الغردقة", "سهل حشيش", "خليج سوما", "مرسى علم"],
  },
  {
    name: "الإسكندرية",
    districts: ["سموحة", "ستانلي", "كفر عبده", "لوران", "رشدي", "العجمي"],
  },
] as const;

export const FINISHING_TYPES = [
  { value: "ultra_super_lux", label: "الترا سوبر لوكس" },
  { value: "super_lux", label: "سوبر لوكس" },
  { value: "finished", label: "تشطيب كامل" },
  { value: "semi_finished", label: "نصف تشطيب" },
  { value: "core_and_shell", label: "على المحارة / طوب أحمر" },
  { value: "furnished", label: "مفروش بالكامل ومكيف" },
] as const;

export const AMENITIES_LIST = [
  "حمام سباحة خاص",
  "حديقة خاصة",
  "إطلالة على بحيرة / لاجون",
  "إطلالة مباشرة على النيل",
  "صف أول على البحر",
  "نظام سمارت هوم (Smart Home)",
  "مصعد خاص",
  "أمن وحراسة 24/7",
  "كاميرات مراقبة",
  "موقف سيارات مغطى",
  "غرفة خادمة بحمام مستقل",
  "غرفة سائق",
  "جاكوزي / سبا",
  "نادي رياضي (جيم)",
  "تكييف مركزي",
  "مطبخ مجهز بالكامل",
  "تراس بانورامي / روف",
  "شرفة واسعة",
  "مسموح بالحيوانات الأليفة",
  "قريب من المدارس الدولية",
] as const;

export const POPULAR_DESTINATIONS = [
  {
    id: "new-cairo",
    name: "القاهرة الجديدة والتجمع",
    governorate: "القاهرة",
    district: "التجمع الخامس",
    propertiesCount: "140+ عقار",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "نبض الفخامة العصرية، المربع الذهبي، وأرقى المجمعات السكنية الخاصة.",
  },
  {
    id: "sheikh-zayed",
    name: "الشيخ زايد وأكتوبر",
    governorate: "الجيزة",
    district: "الشيخ زايد",
    propertiesCount: "95+ عقار",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    description: "هدوء واحات غرب القاهرة، القرب من أركان بلازا وملاعب الجولف الدولية.",
  },
  {
    id: "north-coast",
    name: "الساحل الشمالي ورأس الحكمة",
    governorate: "مطروح",
    district: "الساحل الشمالي",
    propertiesCount: "60+ عقار",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    description: "شواطئ فيروزية برمال بيضاء وملاذ صيفي استثنائي على البحر المتوسط.",
  },
  {
    id: "new-capital",
    name: "العاصمة الإدارية الجديدة",
    governorate: "القاهرة",
    district: "العاصمة الإدارية",
    propertiesCount: "80+ عقار",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "مستقبل الاستثمار العقاري، النهر الأخضر، وأعلى الأبراج الأيقونية.",
  },
  {
    id: "el-gouna",
    name: "الجونة والبحر الأحمر",
    governorate: "البحر الأحمر",
    district: "الجونة",
    propertiesCount: "45+ عقار",
    image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
    description: "سحر العمارة النوبية، اليخوت واللاجونز، وأسلوب حياة شاطئي لا يُضاهى.",
  },
  {
    id: "zamalek",
    name: "الزمالك وضفاف النيل",
    governorate: "القاهرة",
    district: "الزمالك",
    propertiesCount: "35+ عقار",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    description: "أصالة الأحياء التاريخية، أشجار الزمالك العريقة، وإطلالات نيلية خلابة.",
  },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث إضافة" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "area_desc", label: "المساحة: الأكبر أولاً" },
] as const;
