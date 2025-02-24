"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { CreateUserSchema, SignInSchema } from "@repo/common/zod"
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HTTP_BACKEND } from "@repo/common/config";
import Link from "next/link";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignIn) {
            onSignIn();
        } else {
            onSignUp();
        }
    };

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [error, setError] = useState<string | null>(null)

    const router = useRouter();

    const onSignUp = async () => {
        setError(null)
        const result = CreateUserSchema.safeParse({ name, username, email, password })

        if (!result.success) {
            setError(result.error.errors[0].message);
        }

        // api call
        try {
            const res = await axios.post(`${HTTP_BACKEND}/signup`, {
                username: result.data?.username,
                email: result.data?.email,
                password: result.data?.password,
                name: result.data?.name
            })
            toast.success("Account Created")
            router.push("/signin")
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    const onSignIn = async () => {
        setError(null)
        const result = SignInSchema.safeParse({ identifier, password })

        if (!result.success) {
            setError(result.error.errors[0].message);
        }

        // api call
        try {
            const res = await axios.post(`${HTTP_BACKEND}/signin`, {
                identifier: result.data?.identifier,
                password: result.data?.password,
            })
            localStorage.setItem("token", res.data.token);
            router.push("/")
        } catch (error: any) {
            console.log(error);
            // toast.error(error.response.data.message)
        }
    }

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black z-20">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                {isSignIn ? "Signin To Draw" : "Signup to Draw"}
            </h2>

            <form className="my-8" onSubmit={handleSubmit}>

                {
                    isSignIn ? <>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                            <LabelInputContainer>
                                <Label htmlFor="identifier">Enter username or email</Label>
                                <Input id="identifier" placeholder="@" type="text" value={identifier} onChange={(e) => { setIdentifier(e.target.value) }} />
                            </LabelInputContainer>
                        </div>
                        <PasswordBox password={password} setPassword={setPassword} />
                    </> : <>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                            <LabelInputContainer>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Rahul" type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                            </LabelInputContainer>
                        </div>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" placeholder="rahul@gmail.com" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Username</Label>
                            <Input id="password" placeholder="@username" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                        </LabelInputContainer>
                        <PasswordBox password={password} setPassword={setPassword} />
                    </>
                }

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    {
                        isSignIn ? "Sign In" : "Sign Up"
                    }
                    <BottomGradient />
                </button>
                {
                    error && <p className="text-red-500 text-left mt-9"> {error} </p>
                }
            </form>
            <div className="flex justify-center items-center">
                <Link href={"/signin"} className="text-blue-600 font-bold mt-3 text-center">{!isSignIn ? "Already Have an account?" : "New to Draw App"}</Link>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};


const PasswordBox = ({ password, setPassword }: { password: string, setPassword: any }) => {
    return <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
    </LabelInputContainer>
}