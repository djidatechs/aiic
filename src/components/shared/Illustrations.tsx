
import { Newspaper, Wallet } from "lucide-react";
import leaf from "@/../public/leaf.png";
import { createTranslation, getLocale } from "@/lib/i18n/server";

const Illustrations = async () => {
  const {t} = await createTranslation('common');
  const local = getLocale()

  return (
    <section dir={`${local == 'ar' ? 'rtl' : 'ltr' }`} className={`bg-gradient-to-r from-white/95 to-red-100/5 py-8 sm:py-16`} aria-labelledby="hero-heading">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col md:flex-row md:space-x-8 items-center">
          <div className="flex-col my-4 md:my-0 space-y-4 w-full md:w-3/12">
            <div className="mx-auto flex justify-center items-center w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600">
              <Newspaper className="w-20 h-20" color="#f52424" />
            </div>
            <div className="text-center md:text-lg lg:text-xl font-semibold">
              {t('book_appointment')}
            </div>
          </div>
          <div className="flex-col my-4 md:my-0 space-y-4 w-full md:w-6/12">
            <div className="mx-auto flex justify-center items-center w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600">
              <Wallet className="w-20 h-20" color="#f52424" />
            </div>
            <div className="text-center text-sm md:text-lg lg:text-xl font-semibold">
              <p>{t('submit_receipt')}</p>
              <p className="text-sm text-gray-800">{t('in_person_price')}</p>
              <p className="text-sm text-gray-800">{t('online_price')}</p>
            </div>
          </div>
          <div className="flex-col my-4 md:my-0 space-y-4 w-full md:w-3/12">
            <div className="mx-auto flex justify-center items-center w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600">
              <img className="w-20 h-20" src={leaf.src} alt={""} />
            </div>
            <div id="scroll" className="text-center text-sm md:text-lg lg:text-xl font-semibold">
              {t('attend_appointment')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Illustrations;
