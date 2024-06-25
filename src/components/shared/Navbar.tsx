
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import PhoneMenu from "./PhoneMenu";
import { createTranslation, getLocale } from "@/lib/i18n/server";

const Navbar =  async () => {
  const {t} = await createTranslation('common');
  const local = getLocale()
  
  return (
    <header className="bg-red-600 border-b-2 rounded border-b-red-600 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className={`text-white space-x-2 font-bold text-2xl flex items-center`}>
            <Image src={logo} className="w-9 h-8 rounded-xl" alt="Logo" />
            <h1>AIIC</h1>
          </Link>
        
          <nav dir={`${local == "ar" ? "rtl": "ltr"}`} className={`hidden  lg:flex w-full  `}>
            <ul className="flex flex-row space-x-2 overflow-auto ml-auto justify-end  lg:gap-12 lg:space-x-4 mt-4 lg:mt-0">
              <li className="text-lg font-bold text-white">
                <Link href="/">{t('Accueil')}</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <Link href="/about">{t('about')}</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <LanguageSwitcher/>
              </li>
              {/* <li className="text-lg font-bold text-white">
                <Link href="/faq">FAQ</Link>
              </li>
              <li className="text-lg font-bold text-white">
                <Link href="/contact">{t('Contact')}</Link>
              </li> */}
            </ul>
          </nav>

          <PhoneMenu/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
