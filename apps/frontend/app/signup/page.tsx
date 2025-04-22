import { SIGNUP } from "@repo/common/config";
import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";
import { DotBackground } from "../components/ui/DotBackground";

export default function SignUp() {
    return (
        <>
            <DotBackground>
                <NavBar />
                <AuthPage isSignIn={SIGNUP} />
            </DotBackground>
        </>
    )
}