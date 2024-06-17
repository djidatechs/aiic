"use client"
import { useState, ChangeEvent } from 'react';

// Define the type for the props
interface BeforeReciteProps {
  appointmentData: {
    date: string;
    type: string;
    startTime: string;
    name: string;
    location: string;
  };
  onFileUploaded: () => void;
}

export default function BeforeRecite({ appointmentData, onFileUploaded }: BeforeReciteProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleFileSubmit = async () => {
    if (!file) return;

    // Simulate file upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/recite/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully');
        onFileUploaded();
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl text-center">
        Bienvenue à bord de votre projet d'immigration au Canada !
      </h1>
      <p className="mt-4">
        <strong>{appointmentData.name},</strong> merci pour votre réservation le {appointmentData.date} à {appointmentData.startTime}.
      </p>
      {appointmentData.type === 'Online' ? (
        <ul className="list-disc list-inside mt-4">
          <li>Effectuez un paiement de <strong>6000 DA</strong> pour valider votre rendez-vous.</li>
          <li>
            Utilisez le bouton ci-dessous pour télécharger une image de votre reçu de paiement.
          </li>
        </ul>
      ) : (
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
      )}
      <div className="mt-6 flex flex-col items-center">
        <input 
          type="file" 
          accept="image/*"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          onChange={handleFileChange}
        />
        <button 
          onClick={handleFileSubmit} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          disabled={!file}
        >
          Soumettre le reçu
        </button>
      </div>
    </>
  );
}
