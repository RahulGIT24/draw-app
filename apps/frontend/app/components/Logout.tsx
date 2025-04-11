'use client';
import React from 'react'
import { LogOut } from "lucide-react";
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Logout = () => {
    async function revokeToken(){
        await axios.put(`/api/clear-token`)
    }
    const router = useRouter();
    return (
        <span><button title='Log Out' className='hover:bg-slate-700 p-3 rounded-full' onClick={() => {
            signOut()
            revokeToken();
            router.push('/signin')
            toast.success('Logged Out!')
        }}><LogOut size={40} color='white' /></button></span>
    )
}

export default Logout