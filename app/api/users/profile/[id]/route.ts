import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt , {JwtPayload} from 'jsonwebtoken';


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
    
    const user =prisma.user.findUnique({where:{id:id}});
    if(!user){
        return NextResponse.json({message:'there is not user found with this id'})
    }
    const token = request.headers.get('authToken') as string;
    if(!token){
        return NextResponse.json({message: "Unauthorized: No token provided"},{status:401})
    }
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