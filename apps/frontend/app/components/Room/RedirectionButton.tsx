'use client';

import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

interface PropT{
    link:string,
    text:string
}

export default function RedirectionButton({link,text}:PropT){

    const router = useRouter();

    function redirect(){
        router.push(link)
    }

    return (
        <Button text={text} classname="cursor-pointer hover:bg-white hover:text-black" onClick={() => { redirect() }} />
    ) 
}