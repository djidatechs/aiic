"use client";
import { useState, useEffect } from 'react';
import AfterRecite from './AfterRecite';
import BeforeRecite from './BeforeRecite';

// Define the type for the appointment data
interface AppointmentData {
  date: string;
  type: string;
  startTime: string;
  name: string;
  location: string;
}

// Define the props for the Home component
interface HomeProps {
  params: {
    link: string;
  };
}

export default function Home({ params }: HomeProps) {
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(`/api/appointments/rv?link=${params.link}`);

        if (!response.ok) throw new Error('Failed to fetch appointment details');

        const data = await response.json();
        if (data.success && data.appointment) {
          const { date, type, startTime } = data.appointment.workinghours;
          setAppointmentData({
            date: toLocalISOString(new Date(date)),
            type,
            startTime: new Date(startTime).toUTCString().split(' ')[4].split(':').slice(0, 2).join(':'),
            name: `${data.appointment.client.lastName} ${data.appointment.client.firstName}`,
            location: data.appointment.location || 'Location not specified',
          });

          // Check if file is uploaded (simulating backend check)
          const fileResponse = await fetch(`/api/recite/check?link=${params.link}`);
          const fileData = await fileResponse.json();
          setFileUploaded(fileData.uploaded);
        } else {
          throw new Error('Appointment details not found');
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [params.link]);

  if (loading) return <Skeleton />;

  return (
    <main className="pb-11 flex justify-center">
      <div className="mx-auto w-[95%] sm:w-[80%] max-w-[700px] p-4 bg-white rounded-xl my-6 shadow-lg">
        {fileUploaded ? (
          appointmentData && <AfterRecite appointmentData={appointmentData} />
        ) : (
          appointmentData && <BeforeRecite appointmentData={appointmentData} onFileUploaded={() => setFileUploaded(true)} />
        )}
      </div>
    </main>
  );
}

// Helper function to convert date to local ISO string format
function toLocalISOString(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

// Simple skeleton component
function Skeleton() {
  return (
    <main className="pb-11 flex justify-center">
      <div className="mx-auto w-[95%] sm:w-[80%] max-w-[700px] p-4 bg-white rounded-xl my-6 shadow-lg animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
      </div>
    </main>
  );
}