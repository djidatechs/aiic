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


const Languageswitch = () => {
  const [open, setOpen] = useState(false);
  const local = useLocale()
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
        <p
          onClick={() => setOpen(!open)}
          className="underline underline-offset-4"
        >
        {local}
        </p>
      </DropdownMenuTrigger>
      {open ? (
        <DropdownMenuContent>
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

export default Languageswitch;
