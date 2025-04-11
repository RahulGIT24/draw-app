import { BackgroundLines } from "./components/ui/background-lines";
import MainMenu from "./components/MainMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/options";
import Logout from "./components/Logout";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (session === null) {
        return <div className="text-white h-screen text-center">
            <p>Unauthorized</p>
        </div>
    } else {
        return (
            <BackgroundLines className="flex justify-center flex-col items-center">
                <div className="absolute top-10 right-12">
                <Logout/>
                </div>
                <p className="text-white text-7xl font-bold top-20 fixed ">User Space</p>
                <MainMenu />
            </BackgroundLines>
        )
    }
}