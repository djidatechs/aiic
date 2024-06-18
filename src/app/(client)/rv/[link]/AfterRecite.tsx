"use client"
import { useTranslation } from '@/lib/i18n/client';
import { CopyIcon } from 'lucide-react';
import { useState } from 'react';
import general from "@/lib/general.json"

interface AfterReciteProps {
  appointmentData: {
    date: string;
    type: string;
    startTime: string;
    name: string;
    duration:string;
  };
}

export default function AfterRecite({ appointmentData }: AfterReciteProps) {
  const { t } = useTranslation("common");
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const currentUrl = window.location.href;
    const isOnline = appointmentData.type === 'Online';
    const meetingLink = isOnline ? 'https://meet.google.com/your-meeting-link' : ''; //todo
    const bureauLocation = !isOnline ? general.bureau : '';
    
    const appointmentInfo = `${t('appointmentDetails', appointmentData)}
      \nType نوع اللقاء: ${appointmentData.type}
      \nDate التاريخ: ${appointmentData.date}
      \NTime Temp الوقت: ${appointmentData.startTime}
      \nURL الوصل: ${currentUrl}
      ${isOnline ? `\n\nGoogle Meet Link عنوان اللقاء الالكتروني: ${meetingLink}` : `\n\nBureau Location عنوان المكتب: ${bureauLocation}`}
    `;

    const blob = new Blob([appointmentInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointment_info.txt';
    document.body.appendChild(a);
    a.click();
    setDownloaded(true);
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloaded(false);
    }, 0);
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl text-center">
        {t('confirmationMessage')}
      </h1>
      <p className="mt-4">
        <strong>{appointmentData.name},</strong> {t('appointmentDetails', appointmentData)}
      </p>
      {appointmentData.type === 'Online' ? (
        <p className="mt-4">
          {t('onlineMeetingLink')} <a href="https://meet.google.com/your-meeting-link" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lien Google Meet</a>
        </p>
      ) : (
        <p className="mt-4">
          {t('physicalMeetingDetails')} <a href={general.bureau} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Location</a>.
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleDownload} 
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${downloaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={downloaded}
        >
          Télécharger les informations du rendez-vous
        </button>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
        <span className="text-gray-700 break-all">{window.location.href}</span>
        <button 
          onClick={handleCopyLink} 
          className={`ml-2 p-2 bg-red-700 text-white rounded-xl hover:bg-blue-600 transition duraiton-300`}
          
          title="Copier le lien"
        >
          <CopyIcon color="#fff" />
        </button>
      </div>
      <p className="mt-2 bg-yellow-400 p-3 font-semibold text-center text-sm text-black rounded-lg">
        {t('saveLinkInfo')}
      </p>
    </>
  );
}
