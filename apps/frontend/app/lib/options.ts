import { client } from "@repo/db/prisma"
import { SignInSchema } from "@repo/common/zod"
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"
import jwt from 'jsonwebtoken'
import { pushToEmailQueue } from "@repo/email-service/email"
import { SIGNUP } from "@repo/common/config"

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
                            email: true,
                            verified:true
                        }
                    })

                    if (!checkUser) {
                        throw new Error("User not exist")
                    }

                    
                    if(!checkUser.verified){
                        const token =  jwt.sign({email:checkUser.email,name:checkUser.name},'rahul',{expiresIn:'30d'})
                        await pushToEmailQueue({subject:SIGNUP,token})
                        await client.user.update({
                            where:{
                                email:checkUser.email
                            },
                            data:{
                                verificationToken:token
                            }
                        })
                        throw new Error("Account Not Verified. Verification Email Sent")
                    }
                    
                    const token = jwt.sign(checkUser.email,String(process.env.NEXTAUTH_SECRET))
                    const passwordCorrect = await bcrypt.compare(dataValid.data.password, checkUser.password);

                    await client.user.update({
                        where:{
                            id:checkUser.id
                        },
                        data:{
                            userToken:token
                        }
                    })

                    if (passwordCorrect) {
                        const user = {
                            "name": checkUser.name,
                            "username": checkUser.username,
                            "email": checkUser.email,
                            "id":checkUser.id,
                            "userToken":token
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
                token.userToken = user.userToken;
            }

            return token
        },
        async session({session,token}){
            if(token){
                session.user.email = token.email
                session.user.id = token.id
                session.user.username = token.username
                session.user.userToken = token.userToken;
            }
            console.log(session)
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