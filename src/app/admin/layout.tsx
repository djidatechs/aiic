import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./provider";
import AdminNavbar from "@/components/shared/AdminNavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIIC Administration",
  description:
    "Admin platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`bg-[#e0e3e7] ${inter.className}`}>
        <Providers>
          <AdminNavbar/>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
