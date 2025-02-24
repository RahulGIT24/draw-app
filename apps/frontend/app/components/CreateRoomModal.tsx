"use client";
import React from "react"
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { CircleX } from "lucide-react";

type PropTypes = {
    roomSlug: string,
    setRoomSlug: (r: string) => void,
    onSubmit: () => void,
    setClose: (b: boolean) => void
}

export default function CreateRoomModal({ roomSlug, setRoomSlug, onSubmit, setClose }: PropTypes) {
    const placeholders = React.useMemo(() => [
        "Enter Your Room Slug",
        "Room Slug mean Room Name",
        "Start Drawing in Room",
        "Looking for a BlackBoard",
    ], [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomSlug(e.target.value)
    };

    return <div className="h-screen flex flex-col justify-center fixed inset-0 bg-zinc-800 bg-opacity-85  items-center px-4 z-40 ">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
            Enter Your Room Slug
        </h2>
        <p title="Close Modal" onClick={() => {
            setClose(false)
        }} className="text-white fixed top-10 right-10 cursor-pointer z-40"><CircleX width={50} height={50} /></p>
        <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
            value={roomSlug}
            setValue={setRoomSlug}
        />
    </div>
}   