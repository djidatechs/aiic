import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toaster";
import {getLocale} from '@/lib/i18n/server';
import {LocaleProvider} from '@/components/hooks/local';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIIC",
  description:
    "Client platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  return (
    <html lang={locale}>
      <body className={`bg-[#e0e3e7] ${inter.className}`}>
      <LocaleProvider value={locale}>
          <Navbar />
          {children}
          <Toaster />
      </LocaleProvider>
        
      </body>
    </html>
  );
}
