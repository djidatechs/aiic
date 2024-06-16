
import Hero from "@/components/shared/Hero";
import RendezVous from "./RendezVous";
import Illustrations from "@/components/shared/Illustrations";

export default function Home() {
  return (
    <main className="flex flex-col pb-11">
      <Hero />
      <Illustrations/>
      <RendezVous/>
    </main>
  );
}
