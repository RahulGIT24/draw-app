import { AuthPage } from '@/app/components/AuthPage';
import NavBar from '@/app/components/Navbar';
import { DotBackground } from '@/app/components/ui/DotBackground';
import { RESETPASSWORD } from '@repo/common/config';
import React from 'react'

const page = async ({
    params,
  }: {
    params: Promise<{ token: string }>;
  }) => {
    const {token} = await params;
    return (
        <DotBackground>
            <NavBar />
            <AuthPage isSignIn={RESETPASSWORD} token={token}/>
        </DotBackground>
    )
}

export default page