import { Room } from "@/app/types/types";
import Image from "next/image";
import RedirectionButton from "./RedirectionButton";

interface PropT {
    rooms: Room[]
}

const returnLocalString = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString();
}

export default function MyRooms({ rooms }: PropT) {
    return (
        rooms && rooms.length > 0 && rooms.map((r: Room) => (
            <div className="mt-9 bg-zinc-700 p-9 z-20" key={r.id}>
                <Image src="/thumbnail.jpg" alt="thumbnail" className="w-[35vw] h-[30vh]" width={1000} height={1000} />
                <div className="my-4 font-semibold text-2xl">
                    <p className="my-3">Room ID - {r.id}</p>
                    <p className="my-3">Room Slug - {r.slug}</p>
                    <p className="my-3">Creation Time - {returnLocalString(r.createdAt)}</p>
                </div>
                <RedirectionButton link={`/canvas/${r.id}`} text="View Room"/>
            </div>
        ))
    )
}