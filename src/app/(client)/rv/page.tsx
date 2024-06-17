"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function page() {
  const r = useRouter()

  useEffect(()=>{
    r.replace("/")
  },[])
  return (
    <div>redirecting...</div>
  );
}

export default page;