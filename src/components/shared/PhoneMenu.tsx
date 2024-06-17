"use client"
import { Fragment, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,

  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"; // Assuming this is the path to your DropdownMenu components
import { useTranslation } from "@/lib/i18n/client";
import { switchLocaleAction } from "@/lib/i18n/switchLocal";
import { useLocale } from "../hooks/local";


const PhoneMenu = () => {
  const [open, setOpen] = useState(false);
  const {t}= useTranslation("common")
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const  changeLanguage = (lng:string) => {
    switchLocaleAction(lng)
  };
  useEffect(()=>{
    setMenuItems([
        { code: 'ar', label: "العربية"},
        { code: 'fr', label: "français"},
        { code: 'en', label: "English"},
      ])
  },[])




  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
      <div 
      onClick={()=>{setOpen(!open)}}
      className="text-white lg:hidden space-x-2 mt-4 font-extrabold">     
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
          </div>
    
      </DropdownMenuTrigger>
      {open ? (
        <DropdownMenuContent>
          <DropdownMenuGroup>
          <Fragment key={"acc"}>
                <DropdownMenuItem>{t('Accuil')}</DropdownMenuItem>
                <DropdownMenuSeparator />
          </Fragment>
          <Fragment key={"faq"}>
                <DropdownMenuItem>FAQ</DropdownMenuItem>
                <DropdownMenuSeparator />
          </Fragment>
          <Fragment key={"contact"}>
                <DropdownMenuItem>{t('Contact')}</DropdownMenuItem>
                <DropdownMenuSeparator />
          </Fragment>
          <div className="min-h-[2px] h-[2px] w-full min-w-full bg-red-600 px-1"></div>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            {menuItems.map((item, index) => (
              <Fragment key={index}>
                <DropdownMenuItem onClick={()=>changeLanguage(item.code)}>{item.label}</DropdownMenuItem>
                {index < menuItems.length - 1 && <DropdownMenuSeparator />}
              </Fragment>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      ):<></>}
    </DropdownMenu>
  );
};

export default PhoneMenu;
