import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Image from "next/image";
import Logout from "@/app/admin/Logout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const AdminNavbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <header className="bg-red-600 border-b-2 rounded border-b-red-600 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-white space-x-2 font-bold text-2xl flex items-center">
            <Image src={logo} className="w-9 h-8 rounded-xl" alt="Logo" />
            <h1>AIIC Administration</h1>
          </Link>
          { session?.admin?.isAdmin ? <Logout/> : undefined}
        
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
