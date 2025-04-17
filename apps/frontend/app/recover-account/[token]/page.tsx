import { AuthPage } from '@/app/components/AuthPage';
import NavBar from '@/app/components/Navbar';
import { BackgroundLines } from '@/app/components/ui/background-lines';
import { RESETPASSWORD } from '@repo/common/config';
import React from 'react'

const page = async ({ params }: { params: { token: string } }) => {
    const token = (await params).token;
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <NavBar />
            <AuthPage isSignIn={RESETPASSWORD} token={token}/>
        </BackgroundLines>
    )
}

export default page