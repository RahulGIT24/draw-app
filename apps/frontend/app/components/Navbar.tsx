import { Button } from "@repo/ui/button";

export default function NavBar(){
    return (
        <nav className="bg-green-800 text-white invert-0 flex justify-between px-32 h-[8vh] items-center font-semibold text-3xl mb-10">
            <div><p>Draw App</p></div>
            <div>
                <Button text="Sign In" classname="px-3 py-2"/>
            </div>
        </nav>
    )
}