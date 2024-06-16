import RendezVousForm from "./RendezVousForm";


function RendezVous() {
    return (
    <section className="flex flex-col my-11 " >
      <div className="max-w-7xl w-full md:w-[80%]  mx-auto bg-white p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h1>
          <div className="block">
            <RendezVousForm />
          </div>
        </div>
      </div>
    </section>
    );
}

export default RendezVous;