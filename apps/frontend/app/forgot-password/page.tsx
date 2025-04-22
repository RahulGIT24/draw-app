import { FORGOTPASSWORD, SIGNIN } from "@repo/common/config";
import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";
import { DotBackground } from "../components/ui/DotBackground";


export default function page() {
    return (
        <DotBackground>
            <NavBar />
            <AuthPage isSignIn={FORGOTPASSWORD} />
        </DotBackground>

    )
}   