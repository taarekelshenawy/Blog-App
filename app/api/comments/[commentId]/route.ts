import { NextResponse,NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import verifyToken from "@/utils/verifyToken";
import { commentSchema } from "@/utils/ValidationSchema";


const prisma = new PrismaClient();


type PropsData ={
    params:Promise<{
        commentId:string,

    }>
}







export async function PUT(req:NextRequest,props:PropsData){
    try{
        const commentId = (await props.params).commentId;
        const id =Number(commentId)
     
        if(!commentId){
            return NextResponse.json({message:"there is no id for this comment"})
        }
         const userfromToken =verifyToken(req);
        if(userfromToken instanceof NextResponse){
            return userfromToken;
        }
        const user = await prisma.user.findUnique({where:{id:userfromToken.id},
          
        })
   
        if(!user){
            return NextResponse.json({message:"there is no user found"})
        }
     
        const existingComment = await prisma.comment.findUnique({
            where: { id:id}
        });

        if (!existingComment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (existingComment.userId !== userfromToken.id) {
            return NextResponse.json({ message: "Unauthorized: You can only update your own comments" }, { status: 403 });
        }
       
      const body = await req.json() ;

        const validation =commentSchema.safeParse(body);
         if (!validation.success) {
            return NextResponse.json({ message: validation.error}, { status: 400 });
        }
        const newComment =  await prisma.comment.update({
            where:{
                id:id

            },
              data: {
                content: body.content,
                articleId: body.articleId,
                userId: userfromToken.id,
            }
        });
      
    
        return NextResponse.json({'newComment':newComment})
       

    }catch (error){
        return NextResponse.json({
            message:"Internal server 500",
         error: error instanceof Error ? error.message : error
            
        },{
            status:500
        })
    }
    


}


// Delete
// @api/comments/commentId
// private
export async function DELETE(req:NextRequest,props:PropsData){
    try{
        const commentId = (await props.params).commentId;
        const id =Number(commentId)
     
        if(!commentId){
            return NextResponse.json({message:"there is no id for this comment"})
        }
         const userfromToken =verifyToken(req);
        if(userfromToken instanceof NextResponse){
            return userfromToken;
        }
        const user = await prisma.user.findUnique({where:{id:userfromToken.id},
          
        })
   
        if(!user){
            return NextResponse.json({message:"there is no user found"})
        }
     
        const existingComment = await prisma.comment.findUnique({
            where: { id:id}
        });

        if (!existingComment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (existingComment.userId !== userfromToken.id && user.isAdmin!==false) {
            return NextResponse.json({ message: "Unauthorized: You can only update your own comments" }, { status: 403 });
        }
       
    

       
    await prisma.comment.delete({
            where:{
                id:id

            },
            
        });
      
    
        return NextResponse.json({message:"comment deleted"})
       

    }catch (error){
        return NextResponse.json({
            message:"Internal server 500",
         error: error instanceof Error ? error.message : error
            
        },{
            status:500
        })
    }
    


}