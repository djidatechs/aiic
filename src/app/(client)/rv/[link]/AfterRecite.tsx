import { CopyIcon } from 'lucide-react';

// Define the type for the props
interface AfterReciteProps {
  appointmentData: {
    date: string;
    type: string;
    startTime: string;
    name: string;
    location: string;
  };
}

export default function AfterRecite({ appointmentData }: AfterReciteProps) {
  const handleDownload = () => {
    // Logic to download appointment information
    alert("Téléchargement des informations de rendez-vous (logique non implémentée)");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié dans le presse-papiers');
  };

  return (
    <>
      <h1 className="font-bold text-xl text-center">
        Merci, votre rendez-vous est confirmé !
      </h1>
      <p className="mt-4">
        <strong>{appointmentData.name},</strong> vous avez entièrement réservé un rendez-vous pour le {appointmentData.date} à {appointmentData.startTime}.
      </p>
      {appointmentData.type === 'Online' ? (
        <p className="mt-4">
          Votre rendez-vous se déroulera en ligne. Voici votre lien Google Meet : <a href="https://meet.google.com/your-meeting-link" target="_blank" className="text-blue-500 underline">Lien Google Meet</a>
        </p>
      ) : (
        <p className="mt-4">
          Votre rendez-vous se déroulera en présentiel. Veuillez vous rendre à notre bureau local à l'adresse suivante : <a href="https://www.google.com/maps?q=adresse+du+bureau" target="_blank" className="text-blue-500 underline">{appointmentData.location}</a>.
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleDownload} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Télécharger les informations du rendez-vous
        </button>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
        <span className="text-gray-700 break-all">{window.location.href}</span>
        <button 
          onClick={handleCopyLink} 
          className="ml-2 p-2 bg-red-700 text-white rounded-xl"
          title="Copier le lien"
        >
          <CopyIcon color="#fff" />
        </button>
      </div>
      <p className="mt-2 bg-yellow-400 p-3 font-semibold text-center text-sm text-black rounded-lg">
        Veuillez sauvegarder ce lien pour accéder à cette page plus tard si vous ne pouvez pas effectuer le paiement immédiatement.
      </p>
    </>
  );
}
