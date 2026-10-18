
import { NextResponse,NextRequest } from "next/server";
import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient()



type propsData = {
    params: Promise<{
        articleId: string;
    }>;
}



export async function GET(req:NextRequest,props:propsData) {
   
    const params = await props.params;
        
    const articleId = Number(params.articleId);
    
    try {
        const newArticle = await prisma.article.findUnique({where:{id:articleId}});
        return NextResponse.json({ newArticle }, { status: 200 });

    } catch(error){

        return NextResponse.json({ message: "Internal Server Error",errorMsg:error }, { status: 500 });
    }
}