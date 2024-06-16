"use client"
import { signOut } from "next-auth/react";


function Logout() {
    return (
        <button onClick={()=>signOut()}>Signout</button>
    );
}

export default Logout;