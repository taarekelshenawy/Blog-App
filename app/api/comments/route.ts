import { NextResponse,NextRequest } from "next/server";
import { commentSchema } from "@/utils/ValidationSchema";
import { PrismaClient } from "@prisma/client";
import verifyToken from "@/utils/verifyToken";


const prisma = new PrismaClient();



export async function POST(req: NextRequest) {
    try {
        const userfromToken =verifyToken(req);
        if(userfromToken instanceof NextResponse){
            return userfromToken;
        }
        const body = await req.json() 

        const validation =commentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error}, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content: body.content,
                articleId: body.articleId,
                userId: userfromToken.id,
            }
        });

        return NextResponse.json({ newComment, message: 'comment created' }, { status: 201 });

    } catch{

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



export async function GET(req:NextRequest){
    try{
         const userfromToken =verifyToken(req);
        if(userfromToken instanceof NextResponse){
            return userfromToken;
        }
        const user = await prisma.user.findUnique({where:{id:userfromToken.id},
          
        })
   
        if(!user){
            return NextResponse.json({message:"there is no user found"})
        }
      
        if(user.isAdmin === false){
            return NextResponse.json({message:'only admin access'},{status:401})
            
        }
        const comments = await prisma.comment.findMany()
        return NextResponse.json({'comments':comments})
       

    }catch{
        return NextResponse.json({
            message:"Internal server 500",
            
        },{
            status:500
        })
    }
    


}