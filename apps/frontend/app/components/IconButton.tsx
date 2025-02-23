import { ReactNode } from "react";

export default function IconButton({
    icon, onClick, name,activated
}: {
    icon: ReactNode,
    onClick: () => void,
    name: string,
    activated:boolean
}) {
    return <div className={`m-2 cursor-pointer rounded-full bg-black border border-white text-white p-3 hover:bg-white hover:text-zinc-900 outline-none ${activated && "text-zinc-800 bg-white"}`}
     onClick={onClick} title={name}>
        {icon}
    </div>
} ``