"use client";

import { HTTP_BACKEND } from "@repo/common/config";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CollaborateModal({ isCollaborating, setIsCollaborating, roomId, setCollaborateModal }: { isCollaborating: boolean, setIsCollaborating: (b: boolean) => void, roomId: string, setCollaborateModal: (b: boolean) => void }) {
    const [link, setLink] = useState<string>("");

    useEffect(() => {
        if (isCollaborating) {
            setLink(`http://localhost:3000/canvas/${roomId}`)
        }
    }, [])

    // api call
    const toogleCollaboration = async () => {
        try {
            setLink("");
            const data = {
                collaboration: !isCollaborating
            }
            const res = await axios.put(`${HTTP_BACKEND}/room/${roomId}`, data, {
                headers: {
                    "authorization": localStorage.getItem("token")
                }
            })
            setIsCollaborating(!isCollaborating);
            if (data.collaboration === false) {
                setLink("");
            }
            // console.log(res);
            if (res.data.collaboration) {
                setLink(`http://localhost:3000/canvas/${roomId}`)
            } else {
                setLink("");
            }
            toast.success(res.data.message)
        } catch (error: any) {
            setLink("");
            if (error.response.data.message) {
                toast.error(error.response.data.message);
            }
        }
    }


    const copyLink = () => {
        if (link) {
            navigator.clipboard.writeText(link);
            toast.success("Link Copied");
        }
    }

    return <div className="h-screen flex flex-col justify-center fixed inset-0 bg-transparent bg-opacity-85  items-center px-4 z-40" onClick={() => setCollaborateModal(false)}>
        <div className="bg-white w-[23vw] h-[50vh] p-3 flex items-center flex-col gap-y-6 border-purple-700 border rounded-lg" onClick={(e) => e.stopPropagation()}>
            <p className="text-black text-2xl font-bold text-center">Collaborate on DRAW APP</p>
            <p className="text-zinc-700 text-sm text-center">You can enable collaboration and invite others by sending the joining link</p>
            <Button text={!isCollaborating ? "Start Collaboration" : "Stop Collaboration"} classname="bg-white text-zinc-800 border border-zinc-800 hover:text-white hover:bg-zinc-800" onClick={toogleCollaboration} />
            {
                link &&
                <>
                    <p className="text-purple-700">{link}</p>
                    <Button text="Copy Link" onClick={copyLink} classname="bg-zinc-800 text-white border border-white hover:text-zinc-800 hover:bg-white hover:border-zinc-800" />
                </>
            }

        </div>
    </div>
}