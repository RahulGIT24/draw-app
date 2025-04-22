"use client";
import React from "react"
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { CircleX, Loader } from "lucide-react";

type PropTypes = {
    roomSlug: string,
    setRoomSlug: (r: string) => void,
    onSubmit: () => void,
    setClose: (b: boolean) => void
    disabled: boolean
}

export default function CreateRoomModal({ roomSlug, setRoomSlug, onSubmit, setClose, disabled }: PropTypes) {
    const placeholders = React.useMemo(() => [
        "Enter Your Room Slug",
        "Room Slug mean Room Name",
        "Start Drawing in Room",
        "Looking for a BlackBoard",
        "Should be unique"
    ], [])

    return <div className="h-screen flex flex-col justify-center fixed inset-0 bg-zinc-800 bg-opacity-85  items-center px-4 z-40 ">
        {
            !disabled ? <>
                <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
                    Enter Your Room Slug
                </h2>
                <p title="Close Modal" onClick={() => {
                    setClose(false)
                }} className="text-white fixed top-10 right-10 cursor-pointer z-40"><CircleX width={50} height={50} /></p>
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    disabled={disabled}
                    onSubmit={onSubmit}
                    value={roomSlug}
                    setValue={setRoomSlug}
                />
            </> : <>
                <Loader className="animate-spin" color="white" size={200} />
                <p className="text-white text-3xl mt-5">Creating Room. Please Wait...</p>
            </>
        }

    </div>
}   