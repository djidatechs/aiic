import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {getLocale} from '@/lib/i18n/server';
import {LocaleProvider} from '@/components/hooks/local';
import opengraphImage  from '@/../public/og.png'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });
const rubic = Rubik({subsets:["arabic"]});


export const metadata: Metadata = {
  
  title: "AIIC",
  description:"Assistance d'Immigration et d'Intégration au Canada",
  metadataBase: new URL("https://aiic.djidax.com"),
  openGraph : {
    type : "website",
    countryName : "Algeria",
    description : "Assistance d'Immigration et d'Intégration au Canada",
    siteName : "AIIC DJIDA X",
    url : "https://aiic.djidax.com",
    images : opengraphImage.src

  }
};

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  const locale = getLocale();
  return (
    <html lang={locale}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <body className={`bg-[#e0e3e7] ${locale == "ar" ? rubic.className : inter.className}`}>
      <LocaleProvider value={locale}>
          {children}
          <Toaster />
      </LocaleProvider>
      <Analytics/>        
      </body>
    </html>
  );
}
