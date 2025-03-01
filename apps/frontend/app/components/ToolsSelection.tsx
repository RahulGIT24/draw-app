import { ForwardRefExoticComponent, RefAttributes } from "react"
import IconButton from "./IconButton"
import { LucideProps } from "lucide-react"

type PropT = {
    func: () => void,
    activated: boolean,
    name: string,
    Tool: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export default function ToolsSelection({ Tool, func, activated, name }: PropT) {
    return (
        <IconButton icon={<Tool />} onClick={func} name={name} activated={activated} />
    )
}