"use client"
import React from 'react';

function ScrollButton() {
    const scrollToSection = (id:string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    return (
        <button

        onClick={() =>scrollToSection("scroll")}
        className="block rounded bg-red-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-500 focus:outline-none focus:ring active:bg-blue-500">
        Prendre un rendez-vous
      </button>
    );
}

export default ScrollButton;