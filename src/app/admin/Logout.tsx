"use client"
import { signOut } from "next-auth/react";
import Link from "next/link";


function Logout() {
    return (
        <Link href=''  className="text-white space-x-2 font-bold text-xl flex items-center" onClick={()=>signOut()}>
        Sign Out
      </Link>
    );
}

export default Logout;