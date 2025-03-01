import { Loader2 } from "lucide-react";

export default function Loading(){
    return (
        <div className="text-white h-screen w-full flex justify-center items-center">
            <Loader2 className="animate-spin"/>
        </div>
    )
}