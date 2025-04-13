import { Circle, Eraser, Pencil, RectangleHorizontalIcon, Type, UsersRoundIcon } from "lucide-react"
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
    }} className="bg-transparent">
        <div id="curs" className={`flex justify-end  w-full px-6 ${selectedTool === 'text' && 'cursor-text'}`}>
            {
                isAdmin &&
                <span className="">
                    <IconButton icon={<UsersRoundIcon />} onClick={func} name="Collaboration" activated={inCollaboration} />
                </span>
            }
        </div>
        <div className="flex justify-center items-center w-full h-full absolute">
            <div className="flex lg:w-[30%] sm:w-[70%] md:w-[40%] bg-zinc-800 rounded-2xl justify-around items-center">
                <div className="flex">
                    <ToolsSelection Tool={Pencil} func={() => { setSelectedTool('pencil') }} activated={selectedTool === 'pencil'} name="Line" />
                    <ToolsSelection Tool={RectangleHorizontalIcon} func={() => { setSelectedTool('rect') }} activated={selectedTool === "rect"} name="Rectangle" />
                    <ToolsSelection Tool={Circle} func={() => { setSelectedTool('circle') }} activated={selectedTool === "circle"} name="Circle" />
                    <ToolsSelection Tool={Type} func={() => { setSelectedTool('text') }} activated={selectedTool === "text"} name="Text" />
                    <ToolsSelection Tool={Eraser} func={() => { setSelectedTool('eraser') }} activated={selectedTool === "eraser"} name="Eraser" />
                </div>

                <div>
                    <div title="Color" className="relative w-9 h-9 flex justify-center items-center border rounded-full bg-white">
                        <div className="absolute top-10 grid grid-cols-2 grid-rows-2 w-[8rem] bg-black rounded-lg border py-4  gap-y-3 place-items-center">
                            <div title="Blue" className="w-9 h-9 flex justify-center items-center border rounded-full bg-blue-800"></div>
                            <div title="Yellow" className="w-9 h-9 flex justify-center items-center border rounded-full bg-yellow-500"></div>
                            <div title="White" className="w-9 h-9 flex justify-center items-center border rounded-full bg-white"></div>
                            <div title="Green" className="w-9 h-9 flex justify-center items-center border rounded-full bg-green-800"></div>
                            <div title="Red" className="w-9 h-9 flex justify-center items-center border rounded-full bg-red-800"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
}