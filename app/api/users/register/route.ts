import {NextRequest,NextResponse} from 'next/server';
import { registerSchema } from '@/utils/ValidationSchema';
import {PrismaClient} from '@prisma/client';
import bcrypt from "bcrypt"


const prisma = new PrismaClient()
type RegisterFormData={
    username:string,
    email:string,
    password:string,
}

export async function POST(request:NextRequest){
    const body = await request.json() as RegisterFormData;
    const validation = registerSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json({message:'email or password not valid'})
    }
    const user = await prisma.user.findUnique({where:{email:body.email}});
    if(user){
        return NextResponse.json({message:'the user already exist'})
    }
    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(body.password, salt);
    const newUser = await prisma.user.create({
        data:{
            username:body.username,
            email:body.email,
            password:hashpassword,
        }
    })
    return NextResponse.json({user:newUser,message:'user created'},{status:201})

}