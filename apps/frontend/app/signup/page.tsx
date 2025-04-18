import { SIGNUP } from "@repo/common/config";
import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";
import { BackgroundLines } from "../components/ui/background-lines";

export default function SignUp() {
    return (
        <>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <NavBar />
                <AuthPage isSignIn={SIGNUP} />
            </BackgroundLines>
        </>
    )
}