import type { Metadata, Viewport } from "next";
import { Alexandria } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactBar from "@/components/layout/FloatingContactBar";
import "./globals.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "مأوى العقارية | MAWAA REAL ESTATE — بيتك الأقرب لحياتك",
    template: "%s | مأوى العقارية",
  },
  description:
    "المنصة المصرية الرائدة للعقارات الفاخرة والاستثمارية. اكتشف مجموعة مختارة من الفيلات، الشقق الفندقية، والبنتهاوس في التجمع الخامس، الشيخ زايد، العاصمة الإدارية، والساحل الشمالي.",
  keywords: [
    "عقارات مصر",
    "فيلات للبيع التجمع الخامس",
    "عقارات الشيخ زايد",
    "شقق العاصمة الإدارية",
    "شاليهات رأس الحكمة",
    "الساحل الشمالي",
    "بنتهاوس فاخر",
    "مأوى العقارية",
  ],
  authors: [{ name: "مأوى العقارية | MAWAA Real Estate" }],
  creator: "مأوى العقارية",
  metadataBase: new URL("https://mawaa-realestate.eg"),
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://mawaa-realestate.eg",
    title: "مأوى العقارية | بيتك الأقرب لحياتك",
    description:
      "اكتشف مجموعة مختارة من العقارات السكنية والتجارية في مختلف أنحاء مصر. نساعدك على الوصول إلى المكان المناسب لأسلوب حياتك واستثمارك.",
    siteName: "مأوى العقارية",
  },
};

export const viewport: Viewport = {
  themeColor: "#193E32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable}>
      <body className="font-arabic min-h-screen flex flex-col bg-ivory text-charcoal antialiased pb-16 sm:pb-12">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactBar />
      </body>
    </html>
  );
}
