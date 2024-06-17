import Image from "next/image";
import bgHero from "../../../public/bghero22.png";
import ca from "../../../public/ca.png";
import dz from "../../../public/dz.png";
import { createTranslation, getLocale } from "@/lib/i18n/server";

const Hero = async () => {
  const {t} = await createTranslation('common');
  const local = getLocale()


  return (
    <section  className="bg-gradient-to-r from-white/95 to-red-100/5 py-8 sm:py-12" aria-labelledby="hero-heading">
      <div className="w-full max-w-7xl  lg:pl-12 mx-auto px-4 sm:px-6 md:px-8">
        <div  className="flex flex-col lg:flex-row lg:space-x-8">
          <div className={`order-3 px-4 lg:px-0 lg:order-1 max-w-xl lg:w-[48%] ${local=="ar"?"text-right":"lg:text-left"} `}>
            <h1 id="hero-heading" 
            className={`pt-6 lg:p-0 text-center ${local=="ar"?"text-center w-full lg:text-right":"text-left"}  text-2xl md:text-5xl font-extrabold uppercase`}>
              {t('heroHeading')}
              <strong className="block font-extrabold text-red-700">
                {t('heroHighlight')}
              </strong>
            </h1>
            <p className="my-5 text-xl ">{t('appointmentPrompt')}</p>
            <ul dir={`${local == 'ar' ? 'rtl' : 'ltr' }`} className="mt-6 list-disc pl-5 space-y-2 text-xl">
              {(t('services', { returnObjects: true }) as any[] )         
              .map((service:any, index:any) => (
                <li key={index}>{service}</li>
              ))}
            </ul>

          </div>
          <div className="order-2 lg:order-2 lg:w-[48%] mt-0 sm:mt-8 lg:mt-0 flex items-center flex-col">
            <h1 className="py-3 text-3xl text-center font-bold text-red-700">{t('serviceTitle')}</h1>
            <div className="w-[90%] sm:w-full max-w-xs">
              <Image src={bgHero} alt="Hero Background" />
            </div>
          </div>

          <div className="order-1 lg:order-3 max-w-xl lg:w-[3%]">
            <div className="flex flex-row lg:flex-col m-2 w-full" style={{ alignItems: 'flex-start' }}>
              <img src={dz.src} alt="Algeria Flag" className="w-8 h-8" />
              <img src={ca.src} alt="Canada Flag" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
