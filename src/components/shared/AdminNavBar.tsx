"use client"
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Image from "next/image";
import { useState } from "react";

const AdminNavbar =  () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-red-600 border-b-2 rounded border-b-red-600 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-white space-x-2 font-bold text-2xl flex items-center">
            <Image src={logo} className="w-9 h-8 rounded-xl" alt="Logo" />
            <h1>AIIC Administration</h1>
          </Link>
          <button
            className="text-white lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <nav className={`lg:flex ${isMenuOpen ? "block" : "hidden"} w-full lg:w-auto`}>
            
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
