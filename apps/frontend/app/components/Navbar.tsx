import { Button } from "@repo/ui/button";

export default function NavBar(){
    return (
        <nav className="bg-zinc-800 text-white invert-0 flex fixed top-0 w-full justify-center  px-32 h-[8vh] items-center font-semibold text-3xl mb-10">
            <div><p>Welcome To Draw App</p></div>
            {/* <div>
                <Button text="Sign In" classname="px-3 py-2"/>
            </div> */}
        </nav>
    )
}