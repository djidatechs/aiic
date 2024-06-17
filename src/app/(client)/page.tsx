
import Hero from "@/components/shared/Hero";
import RendezVous from "./RendezVous";
import Illustrations from "@/components/shared/Illustrations";

export default function Home() {
  return (
    <main className="flex flex-col pb-11 ">
      <div className="p-2 m-2 lg:mx-6 rounded-xl space-y-3  ">
        <Hero />
        <Illustrations/>
      </div>
      <RendezVous/>
    </main>
  );
}
