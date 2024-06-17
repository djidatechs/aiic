"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function RV() {
  const r = useRouter()

  useEffect(()=>{
    r.replace("/")
  },[])
  return (
    <div>redirecting...</div>
  );
}

export default RV;