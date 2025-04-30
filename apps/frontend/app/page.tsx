import { Button } from "@repo/ui/button";
import { DotBackground } from "./components/ui/DotBackground";
import Link from 'next/link'
import Image from "next/image";
import { AnimatedTooltip } from "./components/ui/animated-tooltip";

export default function Home() {
    type creator = {
        id: number;
        name: string;
        designation: string;
        image: string
        link: string
    }
    const creatorInfo: creator[] = [{
        id: 1,
        name: "Rahul",
        designation: "Creator",
        image: "https://avatars.githubusercontent.com/u/103873656?v=4",
        link: "https://github.com/RahulGIT24"
    }]
    return (<>
        <DotBackground >
            <div className="select-none tab absolute top-0 bg-zinc-900 h-20 z-20 w-full flex justify-between items-center px-6 pt-6">
                <div className="pb-4">
                    <Link href={'/'}><Image src={'/logo.svg'} width={800} height={800} alt="App Logo" className="invert w-40 " /></Link>
                </div>
                <div className="flex items-center  gap-x-5 pb-4">
                    <Link href={"/signin"}><Button text="Sign In" classname="bg-white text-zinc-800 border-transparent py-[4px] px-3 text-lg"></Button></Link>
                    <Link href={"/signup"}><Button text="Join Now" classname="bg-zinc-800 border-transparent text-white py-[4px] px-3 text-lg" /></Link>
                </div>
            </div>
            <div className="flex justify-center flex-col items-center  gap-y-16 select-none">
                <h1 className="z-10 text-6xl font-bold text-white p-4 bg-black shadow-xl shadow-red-500">Unleash Creativity By Drawing on Canvas</h1>
                <video width="1000" height="240" autoPlay loop className="z-40 shadow-lg shadow-white animate-[wiggle_1s_ease-in-out_infinite]">
                    <source src="/video.webm" type="video/webm" />
                </video>
                <div>
                    <AnimatedTooltip items={creatorInfo} />
                </div>
            </div>

        </DotBackground>
    </>)
} 