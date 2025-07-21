"use client";

import { Minus, Plus } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
    currentScale: number,
    setScale: Dispatch<SetStateAction<number>>
}

const Footer = ({ currentScale, setScale }: Props) => {

    return (
        <span className='text-white bottom-10 text-3xl left-10 absolute flex justify-between items-center w-[10%] bg-gray-500 px-6 select-none py-2'>
            <button onClick={() => setScale((prev: number) => {
                if (prev == 50) {
                    return prev
                }
                return prev - 10
            })}><Minus size={25}/></button>
            <p className='text-center text-xl'>{currentScale}</p>
            <button onClick={() => setScale((prev: number) => {
                if (prev == 200) {
                    return prev
                }
                return prev + 10
            })}><Plus size={25}/></button>
            
        </span>
    )
}

export default Footer