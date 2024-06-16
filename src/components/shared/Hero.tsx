import Image from "next/image";
import Link from "next/link";
import bgHero from "../../../public/bghero22.png";
import ScrollButton from "./scrollButton";
import ca from "../../../public/ca.png";
import dz from "../../../public/dz.png";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-white/95 to-red-100/5 py-8 sm:py-12" aria-labelledby="hero-heading">
      <div className="w-full max-w-7xl  lg:pl-12 mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
         
          <div className="order-3 lg:order-1 max-w-xl lg:w-[48%]">
            <h1 id="hero-heading" className="pt-6 lg:p-0 text-center lg:text-left text-2xl md:text-5xl font-extrabold uppercase">
              Vous rêvez de travailler
              <strong className="block font-extrabold text-red-700">
                au Canada ?
              </strong>
            </h1>
            
            <p className="my-5 text-xl">Prenez un rendez-vous pour</p>
            <ul className="mt-6 list-disc pl-5 space-y-2 text-xl">
              <li>Rencontrer l'assistant d'immigration et le guide.</li>
              <li>Préparer votre CV.</li>
              <li>Préparer vos diplômes.</li>
              <li>Traçage de plan d'immigration.</li>
              <li>Traçage de la suite des procédures.</li>
              <li>Proposition de type de traitement de votre immigration.</li>
            </ul>

            <div className="mt-8 flex justify-center lg:justify-start">
              <ScrollButton/>
            </div>
          </div>
          <div className="order-2 lg:order-2 lg:w-[48%] mt-0 sm:mt-8 lg:mt-0 flex items-center flex-col">
            <h1 className="py-3 text-3xl text-center font-bold text-red-700">Assistance d'Immigration et d'Intégration au Canada</h1>
            <Image className="max-w-xs" src={bgHero} alt="Hero Background" />
          </div>
          <div className="order-1 lg:order-3 max-w-xl lg:w-[3%]">
            <div className="flex flex-row lg:flex-col m-2 w-full" style={{ alignItems: 'flex-start' }}>
              <img src={dz.src} alt="" className="w-8 h-8" />
              <img src={ca.src} alt="" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
