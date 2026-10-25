import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt , {JwtPayload} from 'jsonwebtoken';
import verifyToken from "@/utils/verifyToken";
import { updateUserSchema } from "@/utils/ValidationSchema";
import bcrypt from "bcrypt";



const prisma = new PrismaClient()


type PropsData={
    params: Promise<{
        id: string;
    }>;
}



export async function DELETE(request:NextRequest,props:PropsData){
    try{
         const params= (await props.params);
         const id = Number(params.id);
    
    const user = await prisma.user.findUnique({where:{id:id}});
    if(!user){
        return NextResponse.json({message:'there is not user found with this id'})
    }
    const token = request.cookies.get('token')?.value as string;
  
    const decoded =jwt.verify(token,process.env.SECRET_KEY as string) as JwtPayload;

    if(!decoded){
        return NextResponse.json({ message: 'There is no user found with this id' }, { status: 404 })
    }

    const currentuserId = decoded.id;
    if(currentuserId === id){
     await prisma.user.delete({where:{id:id}})
    return NextResponse.json({message:'user deleted successfully'})

    }

  return NextResponse.json(
                { message: "Forbidden: You can only delete your own account" },
                { status: 403 }
            );



    }catch{
        return NextResponse.json({message:"Internal server error"},{status:500})
    }
   
}


//  Get 
// api/users/profile
// private

export async function GET(request:NextRequest,props:PropsData) {
    try{
          const userId=(await props.params).id;
    const id =Number(userId);
    if(!id){
        return NextResponse.json({message:'there is no id for this user'})
    }
   
  
    const user = await prisma.user.findUnique({where:{id:id},
        select:{
                id:true,
            email:true,
            username:true,
            createdAt:true,
            comments:true,
        
        }
    });
    if(!user){
        return NextResponse.json({message:"there is no user found"},{status:404})
    }
     const userFromToken = verifyToken(request);
 if (userFromToken instanceof NextResponse) {
        return userFromToken;
    }
   
     if(userFromToken.id !== user.id){
        return NextResponse.json({message:'forbidden to get profile info'},{status:403})
     }
     return NextResponse.json({user:user})
}
catch{


        return NextResponse.json({
            message:"Internal server Error",
            error:"500"
        })
    }
  
}


//  update
// api/users/profile
// private

export async function PUT(request:NextRequest,props:PropsData) {
    try{
     const userId=(await props.params).id;
    const id =Number(userId);
    if(!id){
        return NextResponse.json({message:'there is no id for this user'})
    }
   
  
    const user = await prisma.user.findUnique({where:{id:id},
        select:{
                id:true,
            email:true,
            username:true,
            createdAt:true,
        
        }
    });
    if(!user){
        return NextResponse.json({message:"there is no user found"},{status:404})
    }
  
     const userFromToken = verifyToken(request);
    if (userFromToken instanceof NextResponse) {
        return userFromToken;
    }
   
     if(userFromToken.id !== user.id){
        return NextResponse.json({message:'forbidden to get profile info'},{status:403})
     }
       const body  = await request.json();
       if(body.password){
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);

       }
       const validation = updateUserSchema.safeParse(body);
          if (!validation.success) {
            return NextResponse.json(
              { message: validation.error.format() }, 
              { status: 400 }
            );
          }
          const newUser = await prisma.user.update({
              where:{
                id:id,

            },
            data:{
                username:body.username,
                email:body.email,
                password:body.password,
            }
          })
      
     return NextResponse.json({newUser:newUser})
}
catch{


        return NextResponse.json({
            message:"Internal server Error",
            error:"500"
        })
    }
  
}

