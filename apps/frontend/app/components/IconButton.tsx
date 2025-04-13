import { ReactNode } from "react";

export default function IconButton({
    icon, onClick, name, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    name: string,
    activated: boolean
}) {
    return <div className={`m-2 cursor-pointer rounded-full bg-black text-white p-3 hover:bg-gray-500 hover:text-white outline-none ${activated && "text-white bg-gray-500 border-gray-500"}`}
        onClick={onClick} title={name}>
        {icon}
    </div>
} ``