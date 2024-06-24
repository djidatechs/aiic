import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./provider";
import AdminNavbar from "@/components/shared/AdminNavBar";


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

        <Providers>
          <AdminNavbar/>
          {children}
          <Toaster />
        </Providers>

  );
}
