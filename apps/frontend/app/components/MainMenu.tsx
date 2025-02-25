"use client";

import { useRouter } from "next/navigation";
import { FocusCards } from "./ui/focus-cards";
import React, { useEffect, useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import { toast } from "sonner";
import { HTTP_BACKEND } from "@repo/common/config";
import axios from "axios";
import JoinRoomModal from "./JoinRoomModal";

type Card = {
    title: string,
    src: string,
    onClick?: () => void
}

export default function MainMenu() {
    const router = useRouter();

    const [collaborateModal, setCollaborateModal] = useState(false);
    const [createRoomModal, setCreateRoomModal] = useState(false);

    const [roomSlug, setRoomSlug] = useState<string>("")

    const cards: Card[] = React.useMemo(() => [
        {
            title: "Create Room",
            src: "/board.png",
            onClick: () => { setCreateRoomModal(true) }
        },
        {
            title: "Collaborate",
            src: "/collaborate.png",
            onClick: () => { setCollaborateModal(true) }
        },
        {
            title: "My Rooms",
            src: "/mydashboard.jpeg",
            onClick: () => { router.push("/myrooms") }
        }
    ], [])

    const createRoom = async () => {
        if (!roomSlug) {
            toast.error("Please Provide Room Slug")
            return;
        }
        try {
            const data = {
                slug: roomSlug
            }
            const res = await axios.post(`${HTTP_BACKEND}/room`, data, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            const id = res.data.room.id as number;
            router.push(`/canvas/${id}`)
            toast.success("Room Created")
        } catch (error: any) {
            if(error.response.data.message){
                toast.error(error.response.data.message);
            }
            // not authorized
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                router.push("/signin")
                toast.error('Session Expired')
            }
        }
    }

    return (
        <>
            {
                createRoomModal && <CreateRoomModal roomSlug={roomSlug} setRoomSlug={setRoomSlug} setClose={setCreateRoomModal} onSubmit={() => { createRoom() }} />
            }
            {
                collaborateModal && <JoinRoomModal setClose={setCollaborateModal} />
            }
            <FocusCards cards={cards} />
        </>
    )
}