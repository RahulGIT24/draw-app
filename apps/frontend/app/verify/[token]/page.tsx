'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyToken = ({ params }: { params: { token: string } }) => {
  const [message, setMessage] = useState('Verifying......');
  const [timer, setTimer] = useState(5);
  const [timerMessage, setTimerMessage] = useState<string | null>(null);
  const router = useRouter();
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = (await params).token;
      try {
        await axios.put(`/api/verify-token?token=${token}`, {});
        setMessage('Account Verified');
      } catch (error) {
        setMessage("Can't Verfiy Token Expired or Invalid");
        return;
      }

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); 
    };

    verifyToken();
  }, []);

  useEffect(() => {
    if(redirect){
      router.replace("/signin")
      return;
    }
    if (message === 'Account Verified' && timer > 0) {
      setTimerMessage(`Navigating to Sign in Page in ${timer} seconds...`);
    }
  }, [timer, message,redirect]);

  return (
    <div className='h-screen flex-col gap-y-8 w-full dark:bg-black flex justify-center items-center text-4xl'>
      <p className="text-center text-white">{message}</p>
      {timerMessage && <p className="text-center text-white">{timerMessage}</p>}
    </div>
  );
};

export default VerifyToken;
