import {z} from "zod";

export const CreateUserSchema = z.object({
    name:z.string({message:"Please Provide a valid name"}),
    username:z.string({message:"Please Provide a valid username"}).min(3,{message:"Username Should contain minimum 3 characters"}).max(20,{message:"Maximum 20 characters allowed in username"}),
    password:z.string({message:"Please Provide a valid password"}).min(8,{message:"Password Should contain minimum 8 characters"}).max(20,{message:"Maximum 20 characters allowed in password"})
})

export const SignInSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(8).max(20)
})