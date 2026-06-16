import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "الحدود للعقارات | نبني الرؤية ونصنع المستقبل",
  description: "في الحدود للعقارات نؤمن أن كل مشروع عظيم يبدأ بفكرة واضحة ورؤية طموحة، ثم يتحول إلى واقع يضيف قيمة حقيقية للمجتمع والاستثمار. حلول تطوير عقاري فاخرة ومستدامة.",
  keywords: ["الحدود للعقارات", "عقارات دبي", "عقارات فاخرة", "تطوير عقاري", "الإمارات", "مشاريع سكنية", "مشاريع تجارية"],
  authors: [{ name: "الحدود للعقارات" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-navy-900 text-ivory-100 font-tajawal selection:bg-gold-500 selection:text-navy-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
