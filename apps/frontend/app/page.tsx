import { Button } from "@repo/ui/button";
import { DotBackground } from "./components/ui/DotBackground";

export default function Home() {
    return (<>
        <DotBackground >
            <div className="tab absolute top-0 bg-zinc-900 h-20 z-20 w-full flex justify-between items-center px-6 pt-6">
                <div>
                    {/* App Logo here */}
                </div>
                <div className="flex items-center  gap-x-5 pb-4">
                    <Button text="Sign In" classname="bg-white text-zinc-800 py-[4px] px-3 text-lg" />
                    <Button text="Join Now" classname="bg-zinc-800 border-transparent text-white py-[4px] px-3 text-lg" />
                </div>
            </div>
            <div className="flex justify-center items-center flex-col gap-y-16">
                <h1 className="z-10 text-6xl font-bold">Welcome to Draw App</h1>
                <video width="1000" height="240" autoPlay className="z-40">
                    <source src="/video.webm" type="video/webm" />
                </video>
            </div>

        </DotBackground>
    </>)
}