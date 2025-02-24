"use client";

import axios from "axios";
import { BackgroundLines } from "../components/ui/background-lines";
import { HTTP_BACKEND } from "@repo/common/config";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Room = {
    id: number,
    slug: string,
    createdAt: string
}

export default function MyRooms() {

    const [myRooms, setMyRooms] = useState<Room[] | null>(null)
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const redirect = (id: number) => {
        setLoading(true);
        router.push(`/canvas/${id}`)
        setLoading(false);
    }

    const getRooms = async () => {
        try {
            const rooms = await axios.get(`${HTTP_BACKEND}/rooms`, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            setMyRooms(rooms.data.rooms);
        } catch (error) {
            toast.error("Error while fetching Rooms")
        }
    }

    const returnLocalString = (d: string) => {
        const date = new Date(d);
        return date.toLocaleString();
    }

    useEffect(() => {
        getRooms();
    }, [])

    return (
        <BackgroundLines className="flex flex-col z-20">
            <p className="text-left px-10 text-white font-semibold font-serif text-5xl mt-10">My Rooms</p>
            <div className="text-white bg-transparent grid grid-cols-4 gap-x-5 p-4" >
                {
                    myRooms && myRooms.map((r) => (
                        <div className="mt-9 bg-zinc-700 p-9 z-20" key={r.id}>
                            <Image src="/thumbnail.jpg" alt="thumbnail" className="w-[35vw] h-[30vh]" width={1000} height={1000} />
                            <div className="my-4 font-semibold text-2xl">
                                <p className="my-3">Room ID - {r.id}</p>
                                <p className="my-3">Room Slug - {r.slug}</p>
                                <p className="my-3">Creation Time - {returnLocalString(r.createdAt)}</p>
                            </div>
                            {/* <Link className="text-white" href={"/canvas/1"}>View Room</Link> */}
                            {
                                !loading ?
                                    <Button text="View Room" classname="cursor-pointer hover:bg-white hover:text-black" onClick={() => { redirect(r.id) }} />
                                    : <Loader2 className="text-white animate-spin" />
                            }
                        </div>
                    ))
                }
            </div>
        </BackgroundLines>
    )
}