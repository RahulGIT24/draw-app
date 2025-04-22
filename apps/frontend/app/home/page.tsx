import { getServerSession } from "next-auth";
import { authOptions } from "../lib/options";
import { DotBackground } from "../components/ui/DotBackground";
import Header from "../components/Home/Header";
import CreateRoom from "../components/Home/CreateRoom";
import MyRooms from "../components/Room/MyRooms";
import { Suspense } from "react";
import { Loader, Loader2 } from "lucide-react";

export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    const page = (await searchParams)?.page || 1;

    if (session === null) {
        return <div className="text-white h-screen text-center">
            <p>Unauthorized</p>
        </div>
    } else {
        return (
            <DotBackground >
                <Header />
                <div className="flex justify-between items-center flex-col w-full h-full">
                    <CreateRoom />
                    <div className="text-white w-full  bg-transparent gap-x-5 p-4 z-40 h-[70vh]" >
                        <Suspense fallback={
                            <div className="h-full flex justify-center items-center -mt-32">
                                <Loader className="animate-spin" color="white" size={200} />
                            </div>
                        }>
                            <MyRooms page={Number(page)}/>
                        </Suspense>
                    </div>
                </div>
            </DotBackground>
        )
    }
}

// export const dynamic = 'auto'