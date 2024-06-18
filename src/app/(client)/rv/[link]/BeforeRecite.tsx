"use client"
import { useState, ChangeEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n/client';
import { CopyIcon } from 'lucide-react';
import LoadingButton from '@/components/shared/LoadingButton';

interface BeforeReciteProps {
    appointmentData: {
      date: string;
      type: string;
      startTime: string;
      name: string;
      duration:string;
    };
    link : string ;
  }
  
// Component function
export default function BeforeRecite({ appointmentData,  link }: BeforeReciteProps) {
  const { t } = useTranslation("common");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [loading,setLoading] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert(t('validImageFileAlert'));
    }
  };

  const handleFileSubmit = async () => {
    setLoading(true)
    if (!file) {
      alert(t('selectFileAlert'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/recite/upload?link=${encodeURIComponent(link)}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          className: "bg-green-600 text-white font-semiBold",
          description: t('fileUploadSuccess'),
        });
        window.location.reload()
      } else {
        const errorData = await response.json();
        alert(`${t('fileUploadFailedAlert')}: ${errorData.error}`);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(t('fileUploadFailedAlert'));
      setLoading(false)
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl text-center">
        {t('welcomeMessage')}
      </h1>
      <p className="mt-4">
        <strong>{appointmentData.name}, </strong> {t('reservationThanks',  appointmentData )}
      </p>
      {appointmentData.type === 'Online' ? (
        <ul className="list-disc list-inside mt-4">
          <li>{t('onlinePaymentInfo')}</li>
          <li>{t('uploadReceipt')}</li>
        </ul>
      ) : (
          <>
            <ul className="list-disc list-inside mt-4">
              <li>{t('offlinePaymentInfo')}</li>
              <li>{t('uploadReceipt')}</li>
            </ul>
            <p className="mt-4">
              {t('remainderPaymentInfo')}
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

        <LoadingButton
          onClick={handleFileSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          
          loading={loading}
        >
          {t('submitReceipt')}
        </LoadingButton>
        

        <div className="mt-6  w-full p-4 bg-gray-100 rounded-lg flex items-center justify-between">
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
      </div>
    </>
  );
}
