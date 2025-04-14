"use client";
import React, { useMemo, useState } from 'react'
import { COLOR, IAvailableColors, IColorMap } from '../types/types';

const ColorsMap = ({ title, color, setColor, setState,setOpen }: IColorMap) => {
    return (
        <div title={title} className={`w-9 h-9 flex justify-center items-center border rounded-full`} style={{ backgroundColor: color }} onClick={() => {
            setColor(color)
            setState(color)
            setOpen(false)
        }} />
    )
}

const ColorPallete = ({ setStrokeStyle }: { setStrokeStyle: (color: COLOR) => void }) => {
    const [selectedColor, setSelectedColor] = useState<COLOR>('#FFFFFF')
    const [modalOpen, setModalOpen] = useState(false);

    const toogleModal = () => {
        setModalOpen(prev => !prev);
    }

    const availableColors = useMemo<IAvailableColors[]>(() => (
        [
            {
                title: "GREEN",
                color: "#28A745",
            },
            {
                title: "WHITE",
                color: "#FFFFFF",
            },
            {
                title: "YELLOW",
                color: "#FFC107",
            },
            {
                title: "RED",
                color: "#DC3545",
            }
        ]
    ), [])

    return (
        <div title="Color" className={`relative w-9 h-9 flex justify-center items-center border rounded-full`} style={{ backgroundColor: selectedColor }} onClick={toogleModal}>
            {
                modalOpen &&
                <div className="absolute top-10 grid grid-cols-2 grid-rows-2 w-[8rem] bg-zinc-900 rounded-lg border py-4  gap-y-3 place-items-center" onClick={(e:any)=>e.stopPropagation()}>
                    {availableColors.map((c) => (
                        <ColorsMap key={c.color} title={c.title} color={c.color} setColor={setStrokeStyle} setState={setSelectedColor} setOpen={setModalOpen}/>
                    ))}
                </div>
            }
        </div>
    )
}

export default ColorPallete