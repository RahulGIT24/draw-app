import { AuthPage } from "../components/AuthPage";
import NavBar from "../components/Navbar";

export default function SignIn(){
    return (
        <>
        <NavBar />
    <AuthPage isSignIn={true}/>
        </>
)
}   