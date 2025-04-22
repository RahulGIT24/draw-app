'use client';

import { Button } from '@repo/ui/button'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import CreateRoomModal from '../CreateRoomModal';


const CreateRoom = () => {
    const [createRoomModal, setCreateRoomModal] = useState(false);
    const [roomSlug, setRoomSlug] = useState<string>("")
    const router = useRouter()
    const [disabled, setDisabled] = useState(false);

    const createRoom = async () => {
        if (!roomSlug) {
            toast.error("Please Provide Room Slug")
            return;
        }
        setDisabled(true)
        try {
            const data = {
                slug: roomSlug
            }
            const res = await axios.post(`/api/room`, data)
            const id = res.data.room.id as number;
            router.push(`/canvas/${id}`)
            toast.success("Room Created")
        } catch (error: any) {
            if (error.response.data.message) {
                toast.error(error.response.data.message);
            }
        } finally {
            setDisabled(false)
        }
    }
    return (
        <div className='relative w-full'>
            <div className='flex justify-between items-center z-50 absolute w-full top-44  px-20'>
                {
                    createRoomModal && <CreateRoomModal roomSlug={roomSlug} setRoomSlug={setRoomSlug} setClose={setCreateRoomModal} onSubmit={() => { createRoom() }} disabled={disabled} />
                }
                <p className="text-white text-5xl font-bold"></p>
                <Button text='+ Create Room' classname='text-white hover:bg-white hover:text-black bg-zinc-800 text-xl font-semibold font-serif' onClick={() => setCreateRoomModal(true)} />
            </div>
        </div>
    )
}

export default CreateRoom