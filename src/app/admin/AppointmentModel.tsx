"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { localetime_options } from '@/lib/utils';
import Recite from './Recite';
import Modal from './Modal';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';


interface AppointmentModelProps {
    whid: string ;
    OnClose : ()=>any;
    setLoading : (b:boolean)=>any;
}

interface Client {
    firstName: string;
    lastName: string;
    age: number;
    phoneNumber: string;
    email: string|undefined;
    wilaya: string;
    ipAddress: string;
    createdAt: string;
    created_At: string;
    updated_At: string;
}

interface Payment { 
    amount: number;
    payed: number;
    recite_path: string | null;
    created_At: string;
    updated_At: string;
}
interface Workinghours {
    type : string;
}

interface Appointment {
    client: Client;
    payment: Payment;
    workinghours : Workinghours;
    state: string;
    link : string;
    description? : string;
    created_At: string;
}

const AppointmentModel: React.FC<AppointmentModelProps> = ({ setLoading:setotherLoading, whid, OnClose }) => {
    const [appointmentData, setAppointmentData] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const editRef = useRef(null); // Specify the type RichTextEditor for useRef

    const router = useRouter();
    const [editorState, setEditorState] = useState(() => {
        const initialContentState = ContentState.createFromText('');
        return EditorState.createWithContent(initialContentState);
      });

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                setotherLoading(true)
                const response = await fetch(`/api/admin/appointment/get/${whid}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await response.json();
                if (data.success && data.appointment) {
                    const { client, payment, state, created_At,link,description,workinghours } = data.appointment;
                    setAppointmentData({
                        client,
                        payment,
                        state,
                        created_At,
                        link,
                        description,
                        workinghours
                    });

                } else {
                    throw new Error('Appointment not found');
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
                router.back(); // Redirect back on error
            } finally {
                setotherLoading(false)
                setLoading(false);
                
            }
        };

        fetchAppointmentData();
    }, [whid]);

    useEffect(()=>{
        if (appointmentData) {
            const initialContentState = ContentState.createFromText(appointmentData.description||'');
            const initialEditorState = EditorState.createWithContent(initialContentState);
            setEditorState(initialEditorState);
          }
    },[appointmentData])

    if (loading) {
        return <Skeleton />;
    }

    return (
        <Modal  onClose={()=>OnClose()}  >
            {appointmentData && (
                <div className="">
                    <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                    <p>
                        <span className="font-bold">Client Name:</span> {appointmentData.client.firstName} {appointmentData.client.lastName}
                    </p>
                    <p>
                        <span className="font-bold">Age:</span> {appointmentData.client.age}
                    </p>
                    <p>
                        <span className="font-bold">Phone Number:</span> {appointmentData.client.phoneNumber}
                    </p>
                    <p>
                        <span className="font-bold">Email:</span> {appointmentData.client.email}
                    </p>
                    <p>
                        <span className="font-bold">Wilaya:</span> {appointmentData.client.wilaya}
                    </p>
                    <p>
                        <span className="font-bold">Type:</span> {appointmentData.workinghours.type}
                    </p>
                    <p>
                        <span className="font-bold">State:</span> {appointmentData.state}
                    </p>
                    <p>
                        <span className="font-bold">Link:</span> {appointmentData.link}
                    </p>
                    <p>
                        <span className="font-bold">Payment Amount:</span> {appointmentData.payment.amount}
                    </p>
                    <p>
                        <span className="font-bold">Payment Payed:</span> {appointmentData.payment.payed }
                    </p>
                            
                    <p>
                        <span className="font-bold">Created Date:</span> 
                        &nbsp; 
                        {new Date(appointmentData.created_At).toLocaleDateString('en-GB', localetime_options).split(',')[0] } 
                        &nbsp; 
                        {new Date(appointmentData.created_At).toLocaleTimeString('en-GB', localetime_options).slice(0, 5) } 
                    </p>
                   
                    {
                        (appointmentData.description  && appointmentData.description.length) && (
                            <div className='my-3'>
                                 <p>
                                    <span className="font-bold">Additional info</span> 
                                </p>
                                <RichTextEditor editorState={editorState}
                                toolbar={{options: [],inline: {options: []}}}
                                />
                            </div>

                        )
                    }
            
  
                    {
                        appointmentData.payment.recite_path 
                        ? (
                        <>
                            <p><span className="font-bold">Recite:</span></p>
                            <Recite recite_path={appointmentData.payment.recite_path} />
                        </>
                        )
                        : undefined
                    }
                </div>
            )}
        </Modal>
    );
};

export default AppointmentModel;

// Skeleton component for loading state
const Skeleton: React.FC = () => {
    return (
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-pulse">
         
            </div>
    );
};
