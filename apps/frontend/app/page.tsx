import { Button } from "@repo/ui/button";
import Image from 'next/image'
import { BackgroundLines } from "./components/ui/background-lines";
import MainMenu from "./components/MainMenu";

export default function Home() {
    return (
        <BackgroundLines className="flex justify-center flex-col items-center">
            <p className="text-white text-7xl font-bold top-20 fixed ">User Space</p>
            <MainMenu/>
        </BackgroundLines>
    )
}       