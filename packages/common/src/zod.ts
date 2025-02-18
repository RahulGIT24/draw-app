import {z} from "zod";

export const CreateUserSchema = z.object({
    name:z.string({message:"Please Provide a valid name"}),
    username:z.string({message:"Please Provide a valid username"}).min(3,{message:"Username Should contain minimum 3 characters"}).max(20,{message:"Maximum 20 characters allowed in username"}),
    password:z.string({message:"Please Provide a valid password"}).min(8,{message:"Password Should contain minimum 8 characters"}).max(20,{message:"Maximum 20 characters allowed in password"}),
    email:z.string().email({message:"Invalid Email Address"})
})

export const SignInSchema = z.object({
    identifier:z.string().min(3).max(20).or(z.string().email({message:"Invalid Email Address"})),
    password:z.string().min(8).max(20)
})

export const CreateRoomSchema = z.object({
    slug:z.string().min(3,{message:"Slug should have minimum 3 characters"}).max(20,{message:"Slug should have max of 20 characters"}),
})

export const CreateShapeSchema = z.object({
    type:z.string({message:"Type is required"}),
    x:z.number({message:"X axis is required"}),
    y:z.number({message:"Y axis is required"}),
    width:z.number({message:"width axis is required"}),
    height:z.number({message:"height axis is required"}),
    strokeStyle:z.string({message:"stroke style axis is required"}),
    fillStyle:z.string({message:"fill style axis is required"}),
})