import {Circle, Eraser, Pencil, RectangleHorizontalIcon, Type, UsersRoundIcon } from "lucide-react"
import { Tools } from "../types/types"
import ToolsSelection from "./ToolsSelection"
import IconButton from "./IconButton"

export default function TopBar({ selectedTool, setSelectedTool, inCollaboration, isAdmin, func }: {
    selectedTool: Tools,
    setSelectedTool: (t: Tools) => void,
    inCollaboration: boolean,
    isAdmin: boolean,
    func: () => void
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10,
        width: '100vw'
    }}>
        <div className={`flex justify-between w-full px-6 ${selectedTool === 'text' && 'cursor-text'} ${selectedTool==='eraser' && `cursor-[url('https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-clipart-of-white-eraser-illustration-png-image_12902861.png'), auto]`}`}>
            <div className="flex w-full">
                <ToolsSelection Tool={Pencil} func={() => { setSelectedTool('pencil') }} activated={selectedTool === 'pencil'} name="Line" />
                <ToolsSelection Tool={RectangleHorizontalIcon} func={() => { setSelectedTool('rect') }} activated={selectedTool === "rect"} name="Rectangle" />
                <ToolsSelection Tool={Circle} func={() => { setSelectedTool('circle') }} activated={selectedTool === "circle"} name="Circle" />
                <ToolsSelection Tool={Type} func={() => { setSelectedTool('text') }} activated={selectedTool === "text"} name="Text" />
                <ToolsSelection Tool={Eraser} func={() => { setSelectedTool('eraser') }} activated={selectedTool === "eraser"} name="Eraser" />
            </div>
            {
                isAdmin &&
                <div>
                    <IconButton icon={<UsersRoundIcon />} onClick={func} name="Collaboration" activated={inCollaboration} />
                </div>
            }
        </div>
    </div>
}