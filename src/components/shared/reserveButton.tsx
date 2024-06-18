"use client"
import React from 'react';
import { useLocale } from '../hooks/local';

function ScrollButton({text}:{text:string}) {
    const local = useLocale()
    const scrollToSection = (id:string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    return (
        <div dir={`${local == 'ar' ? 'rtl' : 'ltr' }`} className='w-ull'>
        <button
        onClick={() =>scrollToSection("scroll")}
        className="block rounded my-6 bg-red-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-500 focus:outline-none focus:ring active:bg-red-900">
        {text}
      </button>
      </div>
    );
}

export default ScrollButton;