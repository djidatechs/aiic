"use client";
import { useState, useEffect } from 'react';
import { CopyIcon } from 'lucide-react';

export default function Home() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [appointmentType, setAppointmentType] = useState('présentiel'); // Changed from 'presentiel' to 'présentiel'
  const appointmentDate = '2024-06-20'; // Example date
  const appointmentHour = '14:00'; // Example time
  const appointmentLocation = '[Adresse du bureau]'; // Example address
  const [privateLink, setPrivateLink] = useState('');

  useEffect(() => {
    setPrivateLink(window.location.href); // Set the private link to the current URL

    const handleBeforeUnload = (e:any) => {
      const confirmationMessage = 'Êtes-vous sûr de vouloir quitter la page?';
      (e || window.event).returnValue = confirmationMessage; // Gecko + IE
      return confirmationMessage; // Webkit, Safari, Chrome
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleFileUpload = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      // Logic to handle file upload can be added here
      setFileUploaded(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(privateLink);
    alert('Lien copié dans le presse-papiers');
  };

  const handleDownload = () => {
    // Logic to download appointment information
    alert("Téléchargement des informations de rendez-vous (logique non implémentée)");
  };

  return (
    <main className="pb-11 flex justify-center">
      <div className="mx-auto w-[95%] sm:w-[80%] max-w-[700px] p-4 bg-white rounded-xl my-6 shadow-lg">
        {fileUploaded ? (
          <>
            <h1 className="font-bold text-xl text-center">
              Merci, votre rendez-vous est confirmé !
            </h1>
            <p className="mt-4">
              Vous avez entièrement réservé un rendez-vous pour le {appointmentDate} à {appointmentHour}.
            </p>
            {appointmentType === 'en ligne' ? (
              <p className="mt-4">
                Votre rendez-vous se déroulera en ligne. Voici votre lien Google Meet : <a href="https://meet.google.com/your-meeting-link" target="_blank" className="text-blue-500 underline">Lien Google Meet</a>
              </p>
            ) : (
              <p className="mt-4">
                Votre rendez-vous se déroulera en présentiel. Veuillez vous rendre à notre bureau local à l'adresse suivante : <a href="https://www.google.com/maps?q=adresse+du+bureau" target="_blank" className="text-blue-500 underline">{appointmentLocation}</a>.
              </p>
            )}
            <p className="mt-4">
              En cas de problème avec le reçu, nous vous contacterons par téléphone pour résoudre le problème.
            </p>
            <p className="mt-4">
              Nous vous appellerons dès que possible pour confirmer les arrangements.
            </p>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleDownload} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Télécharger les informations du rendez-vous
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-bold text-xl text-center">
              Bienvenue à bord de votre projet d'immigration au Canada !
            </h1>
            <p className="mt-4">
              Merci pour votre réservation. Afin de confirmer votre rendez-vous, veuillez suivre les instructions ci-dessous :
            </p>
            <ul className="list-disc list-inside mt-4">
              <li>Effectuez un paiement initial de <strong>3000 DA</strong> pour valider votre rendez-vous.</li>
              <li>
                Utilisez le bouton ci-dessous pour télécharger une image de votre reçu de paiement.
              </li>
            </ul>
            <p className="mt-4">
            le reste du paiement, de <strong>3000 DA</strong>,  se fera lors du rendez-vous
            </p>
            
            <p className="mt-4 font-bold">
              Important :
            </p>
            <p className='text-justify'>
              Vous avez <strong>48 heures</strong> pour effectuer le paiement initial et télécharger le reçu. Si le paiement n'est pas effectué dans ce délai, votre réservation sera annulée automatiquement.
            </p>
            <div className="mt-6 flex justify-center">
              <label className="block">
                <span className="sr-only">Télécharger votre reçu de paiement</span>
                <input 
                  type="file" 
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </>
        )}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 break-all">{privateLink}</span>
          <button 
            onClick={handleCopyLink} 
            className="ml-2 p-2 bg-red-700 text-white rounded-xl"
            title="Copier le lien"
          >
            <CopyIcon  color="#fff" />
          </button>
        </div>
        <p className="mt-2 bg-yellow-400 p-3 font-semibold text-center text-sm text-black rounded-lg">
          Veuillez sauvegarder ce lien pour accéder à cette page plus tard si vous ne pouvez pas effectuer le paiement immédiatement.
        </p>
      </div>
    </main>
  );
}
