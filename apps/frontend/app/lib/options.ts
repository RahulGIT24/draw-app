import { client } from "@repo/db/prisma"
import { SignInSchema } from "@repo/common/zod"
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"

export const authOptions:AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: "identifier", type: "text", placeholder: "Enter your username or email" },
                password: { label: "Password", type: "password", placeholder: "Enter Your Password" }
            },
            async authorize(credentials, req): Promise<any> {
                try {
                    const dataValid = SignInSchema.safeParse(credentials);

                    if (!dataValid.success) {
                        throw new Error("Invalid Credentials")
                    }

                    const checkUser = await client.user.findFirst({
                        where: {
                            OR: [
                                { email: dataValid.data.identifier },
                                { username: dataValid.data.identifier }
                            ]
                        },
                        select: {
                            id: true,
                            password: true,
                            name: true,
                            username: true,
                            email: true
                        }
                    })

                    if (!checkUser) {
                        throw new Error("User not exist")
                    }

                    const passwordCorrect = await bcrypt.compare(dataValid.data.password, checkUser.password);

                    if (passwordCorrect) {
                        const user = {
                            "name": checkUser.name,
                            "username": checkUser.username,
                            "email": checkUser.email,
                            "id":checkUser.id
                        }
                        return user;
                    }else{
                        throw new Error("Invalid Credentials")
                    }

                } catch (e: any) {
                    throw new Error(e);
                }
            },
        })
    ],
    callbacks:{
        async jwt({token,user}) {
            if(user){
                token.id = user.id,
                token.email = user.email,
                token.username = user.username
            }

            return token
        },
        async session({session,token}){
            if(token){
                session.user.email = token.email
                session.user.id = token.id
                session.user.username = token.username
            }
            return session
        }
    },
    pages:{
        signIn:"/signin"
    },
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET
}