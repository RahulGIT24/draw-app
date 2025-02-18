"use client";
import Input from "@repo/ui/input"
import { Button } from '@repo/ui/button'
import { useState } from "react";
import { CreateUserSchema, SignInSchema } from "@repo/common/zod"
import axios from "axios"
import { useRouter } from "next/navigation";
import {toast} from "sonner"

export function AuthPage({ isSignIn }: {
    isSignIn: boolean
}) {
    const router = useRouter();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [identifier, setIdentifier] = useState('')


    const onSignUp = async () => {
        setError(null)
        const result = CreateUserSchema.safeParse({ name, username, email, password })

        if (!result.success) {
            setError(result.error.errors[0].message);
        }

        // api call
        try {
            const res = await axios.post("http://localhost:5000/signup", {
                username: result.data?.username,
                email: result.data?.email,
                password: result.data?.password,
                name: result.data?.name
            })
            router.push("/signin")
            console.log(res);
        } catch (error:any) {
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
            const res = await axios.post("http://localhost:5000/signin", {
                identifier: result.data?.identifier,
                password: result.data?.password,
            })
            localStorage.setItem("token",res.data.token);
            router.push("/")
        } catch (error:any) {
            toast.error(error.response.data.message)
        }
    }

    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-4 m-2 bg-white rounded-md">
            {
                !isSignIn ? <>
                    <p className="text-center my-5 font-semibold text-3xl text-green-700">Create Your Account</p>
                    <div className="p-2">
                        <Input type="text" placeholder="Enter Name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }} value={name} classname="border-2 border-green-700 rounded-md outline-none" />
                    </div>
                    <div className="p-2">
                        <Input type="text" placeholder="Enter username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }} value={username} classname="border-2 border-green-700 rounded-md outline-none" />
                    </div>
                    <div className="p-2">
                        <Input type="email" placeholder="Enter Email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }} value={email} classname="border-2 border-green-700 rounded-md outline-none" />
                    </div>
                </> :
                <>
                <p className="text-center my-5 font-semibold text-3xl text-green-700">Log into Your account</p>
                    <div className="p-2">
                        <Input type="text" placeholder="Enter username/email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIdentifier(e.target.value) }} value={identifier} classname="border-2 border-green-700 rounded-md outline-none" />
                    </div>
                </>
            }

            <div className="p-2">
                <Input type="password" placeholder="Enter password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} value={password} classname="border-2 border-green-700 rounded-md outline-none" />
            </div>
            {
                typeof error === 'string' && <p className="text-red-500 font-normal">{error}</p>
            }
            <Button classname="bg-green-700 mt-5 hover:bg-green-600 rounded-lg text-white p-2 font-medium w-full" onClick={() => {
                if (isSignIn) {
                    onSignIn()
                } else {
                    onSignUp()
                }
            }} text={isSignIn ? "Sign In" : "Sign Up"} />
        </div>
    </div>
}