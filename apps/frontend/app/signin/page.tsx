import { SIGNIN } from "@repo/common/config";
import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";
import { DotBackground } from "../components/ui/DotBackground";

export default function SignIn() {
    return (
        <>
            <DotBackground>
            <NavBar />
                <AuthPage isSignIn={SIGNIN} />
            </DotBackground>
        </>
    )
}