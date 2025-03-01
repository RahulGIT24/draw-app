"use client";

import { useMemo, useState } from "react"
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input"
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinRoomModal ({setClose}:{setClose:(b:boolean)=>void}){
    const placeholders = useMemo(()=>(
        ["Enter Joining Link"]
    ),[])

    const [link,setLink] = useState("");
    const router = useRouter()

    const onSubmit  = ()=>{
        if(link){
            router.push(link)
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center fixed inset-0 bg-zinc-800 bg-opacity-85  items-center px-4 z-40 ">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
            Enter Joining Link
        </h2>
        <p title="Close Modal" onClick={() => {
            setClose(false)
        }} className="text-white fixed top-10 right-10 cursor-pointer z-40"><CircleX width={50} height={50} /></p>
        <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onSubmit={onSubmit}
            value={link}
            setValue={setLink}
        />
    </div>
    )
}