"use client"
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Image from "next/image";
import { useState } from "react";

const Navbar =  () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="bg-red-600 border-b-2 rounded border-b-red-600 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className={`text-white space-x-2 font-bold text-2xl flex items-center ${isMenuOpen?"hidden":""}`}>
            <Image src={logo} className="w-9 h-8 rounded-xl" alt="Logo" />
            <h1>AIIC</h1>
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
          <nav className={`lg:flex w-full lg:w-auto ${isMenuOpen ? "flex w-11/22 items-center" : "hidden"} `}>
            <ul className="flex flex-row space-x-2 overflow-auto ml-auto  lg:gap-12 lg:space-x-4 mt-4 lg:mt-0">
              <li className="text-lg font-bold text-white">
                <Link href="/">Accueil</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <Link onClick={()=>scrollToSection("scroll")} href="">Formulaire</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <Link href="/faq">FAQ</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
