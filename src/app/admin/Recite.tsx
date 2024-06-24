"use client";
import { useState, useEffect } from 'react';

// Define the props for the Recite component
interface ReciteProps {
    recite_path: string;
}

export default function Recite(params: ReciteProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchImagePath = async () => {
      try {
        const response = await fetch(`/api/admin/recite/get?recite_path=${params.recite_path}`);

        if (!response.ok) return;

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgUrl(reader.result as string);
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image details:', error);
        setLoading(false);
      }
    };

    fetchImagePath();
  }, [params.recite_path]);

  if (loading) return <Skeleton />;

  return (
    <div className="mx-auto w-[95%] sm:w-[80%] max-w-[500px] p-4 bg-white rounded-xl my-6 shadow-lg">
      {imgUrl && <img src={imgUrl} alt="Fetched Image"/>}
    </div>
  );
}

// Simple skeleton component
function Skeleton() {
  return (
    <main className="pb-11 flex justify-center">
      <div className="mx-auto w-[95%] sm:w-[80%] max-w-[700px] p-4 bg-white rounded-xl my-6 shadow-lg animate-pulse">
      </div>
    </main>
  );
}
