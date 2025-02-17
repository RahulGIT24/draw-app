import { Button } from "@repo/ui/button";
import Image from 'next/image'

export default function Home() {
    return (
        <main className="grid grid-cols-2 grid-rows-2 text-white place-items-center h-[87vh]">
            <div className="w-[47vw] h-[40vh]  flex justify-around items-center border-amber-800 border-8  bg-green-900 flex-col shadow-lg shadow-black">
                <Image      
                    src="/board.png"
                    width={400}
                    height={400}    
                    alt="Picture of the board"
                />
                <Button text={"Your Board"} classname="bg-green-700 p-3 border-amber-800 border-8 hover:bg-green-600 w-[50%] font-semibold rounded-lg" />
            </div>
            <div className="w-[47vw] h-[40vh] flex justify-around items-center border-amber-800 border-8 bg-green-900 flex-col shadow-lg shadow-black">
            <Image
                    src="/join.png"
                    width={300}
                    height={300}
                    alt="Join Room"
                    className="invert"
                />
                <Button text={"Join a Room"} classname="bg-green-700 p-3 border-amber-800 border-8 hover:bg-green-600 w-[50%] font-semibold rounded-lg" />
            </div>
            <div className="w-[47vw] h-[40vh] flex justify-around items-center border-amber-800 border-8 bg-green-900 flex-col shadow-lg shadow-black">
            <Image
                    src="/create.png"
                    width={300}
                    height={300}
                    alt="Create Room"
                    className="invert"
                />
                <Button text={"Create a Room"} classname="bg-green-700 p-3 border-amber-800 border-8 hover:bg-green-600 w-[50%] font-semibold rounded-lg" />

            </div>
            <div className="w-[47vw] h-[40vh] flex justify-around items-center border-amber-800 border-8 bg-green-900 flex-col shadow-lg shadow-black">
            <Image
                    src="/load.png"
                    width={300}
                    height={300}
                    alt="Load existing"
                    className="invert"
                />
                <Button text={"Load Existing Art"} classname="bg-green-700 p-3 border-amber-800 border-8 hover:bg-green-600 w-[50%] font-semibold rounded-lg" />
            </div>
        </main>
    )
}       