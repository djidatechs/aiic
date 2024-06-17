import { useState, ChangeEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';

interface BeforeReciteProps {
    appointmentData: {
      date: string;
      type: string;
      startTime: string;
      name: string;
    };
    link : string ;
  }
  
// Component function
export default function BeforeRecite({ appointmentData,  link }: BeforeReciteProps) {
  const { t } = useTranslation("common");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert(t('validImageFileAlert'));
    }
  };

  const handleFileSubmit = async () => {
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
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`${t('fileUploadFailedAlert')}: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(t('fileUploadFailedAlert'));
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl text-center">
        {t('welcomeMessage')}
      </h1>
      <p className="mt-4">
        <strong>{appointmentData.name},</strong> {t('reservationThanks', { appointmentData })}
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
        <button
          onClick={handleFileSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {t('submitReceipt')}
        </button>
        <p className="mt-2 bg-yellow-400 p-3 font-semibold text-center text-sm text-black rounded-lg">
          {t('saveLinkInfo')}
        </p>
      </div>
    </>
  );
}
