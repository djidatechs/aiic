"use client"
import { useState, useEffect } from 'react';
import { CopyIcon } from 'lucide-react';

export default function Home({ params }: { params: { link: string } }) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [appointmentType, setAppointmentType] = useState('InPerson');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentHour, setAppointmentHour] = useState('');
  const [appointmentLocation, setAppointmentLocation] = useState('Location');
  const [privateLink, setPrivateLink] = useState('');
  const [name, setName] = useState('')
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your-api-endpoint' with your actual API endpoint
        const response = await fetch(`/api/appointments/rv?link=${params.link}`); // Adjust this URL as per your Next.js API route

        if (!response.ok) {
          throw new Error('Failed to fetch appointment details');
        }

        const data = await response.json();

        // Update state with fetched data
        if (data.success && data.appointment) {
          const { date, type, startTime } = data.appointment.workinghours;
          setAppointmentDate(toLocalISOString(new Date(date)));
          setAppointmentHour(new Date(startTime).toUTCString().split(' ')[4].split(':').slice(0, 2).join(':'))
          setAppointmentType(type);
        //   setAppointmentLocation(data.appointment.appointmentLocation); // Assuming this property exists
          setPrivateLink(window.location.href); // Example, replace with actual link logic if different
          setName(data.appointment.client.lastName+" "+data.appointment.client.firstName)
          
        } else {
          throw new Error('Appointment details not found');
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        // Handle error scenario
      }
    };

    fetchData();

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
  if (appointmentDate.length===0) return <></>

  return (
    <main className="pb-11 flex justify-center">
      <div className="mx-auto w-[95%] sm:w-[80%] max-w-[700px] p-4 bg-white rounded-xl my-6 shadow-lg">
        {fileUploaded ? (
          <>
            <h1 className="font-bold text-xl text-center">
              Merci, votre rendez-vous est confirmé !
            </h1>
            <p className="mt-4">
                <strong>{name},</strong> vous avez entièrement réservé un rendez-vous pour le {appointmentDate} à {appointmentHour}.
            </p>
            {appointmentType === 'Online' ? (
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
            <strong>{name},</strong> merci pour votre réservation le {appointmentDate} à {appointmentHour}. Afin de confirmer votre rendez-vous, veuillez suivre les instructions ci-dessous :
            </p>
           {appointmentType=="Online"? 
           <ul className="list-disc list-inside mt-4">
           <li>Effectuez un paiement de <strong>6000 DA</strong> pour valider votre rendez-vous.</li>
           <li>
             Utilisez le bouton ci-dessous pour télécharger une image de votre reçu de paiement.
           </li>
           </ul>
           : (
            <>
            <ul className="list-disc list-inside mt-4">
            <li>Effectuez un paiement initial de <strong>3000 DA</strong> pour valider votre rendez-vous.</li>
            <li>
              Utilisez le bouton ci-dessous pour télécharger une image de votre reçu de paiement.
            </li>
            </ul>
            <p className="mt-4">
                Le reste du paiement, de <strong>3000 DA</strong>, se fera lors du rendez-vous.
            </p>
            </>
           )
           }
            
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
            <CopyIcon color="#fff" />
          </button>
        </div>
        <p className="mt-2 bg-yellow-400 p-3 font-semibold text-center text-sm text-black rounded-lg">
          Veuillez sauvegarder ce lien pour accéder à cette page plus tard si vous ne pouvez pas effectuer le paiement immédiatement.
        </p>
      </div>
    </main>
  );
}



function toLocalISOString(date: Date) {
    const pad = (num: any) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }