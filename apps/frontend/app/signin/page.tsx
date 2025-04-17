import { SIGNIN } from "@repo/common/config";
import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";
import { BackgroundLines } from "../components/ui/background-lines";


export default function SignIn() {
    return (
        <>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <NavBar />
                <AuthPage isSignIn={SIGNIN} />
            </BackgroundLines>
        </>
    )
}