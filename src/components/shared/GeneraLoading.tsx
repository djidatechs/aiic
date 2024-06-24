"use client"
import Image from "next/image";
import logo from "../../../public/logo.jpg";
function GeneralLoading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center justify-center">
            <div className="rounded-full p-2 bg-gray-200">
            <Image src={logo} className="w-16 h-14 rounded-xl" alt="aiic" />
            </div>
        </div>
        <p className="mt-4 text-gray-600 text-sm">...</p>
        </div>
    );
}

export default GeneralLoading;