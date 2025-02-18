import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";

export default function SignUp() {
    return (
        <>
            <NavBar></NavBar>
            <AuthPage isSignIn={false} />
        </>
    )
}