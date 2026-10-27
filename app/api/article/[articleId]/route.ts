
import { NextResponse,NextRequest } from "next/server";
import {PrismaClient} from '@prisma/client';
import { AtricleValidationSchema } from "@/utils/ValidationSchema";



const prisma = new PrismaClient()



type propsData = {
    params: Promise<{
        articleId: string;
    }>;
}

type updateData ={
    title?:string,
    description?:string,
}



export async function GET(req:NextRequest,props:propsData) {
   
    const params = await props.params;
        
    const articleId = Number(params.articleId);
    
    try {
        const newArticle = await prisma.article.findUnique({where:{id:articleId},
           include:{
            comments:{
                include:{
                    user:{
                        select:{
                            username:true,
                        }
                    }
                }
            }
           }
        });
        return NextResponse.json({ newArticle }, { status: 200 });

    } catch(error){

        return NextResponse.json({ message: "Internal Server Error",errorMsg:error }, { status: 500 });
    }
}


export async function PUT(req:NextRequest,props:propsData) {
    try {
        
         const params = await props.params;
        const articleId = Number(params.articleId);

        const article = prisma.article.findUnique({where:{id:articleId}})
        const body = await req.json() as updateData;
        const validation = AtricleValidationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error}, { status: 400 });
        }
        if(!article){
            return NextResponse.json({message:'there is no article found'})
        }

        const newArticle = await prisma.article.update({
            where:{
                id:articleId

            },
            data: {
                title: body.title,
                description: body.description,
             
            }
        });

        return NextResponse.json({ newArticle, message: 'article created' }, { status: 201 });

    } catch{

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, props: propsData) {
    try {
        const params = await props.params;
        const articleId = Number(params.articleId);

        const article = await prisma.article.findUnique({
            where: { id: articleId }
        });

        if (!article) {
            return NextResponse.json({ message: 'there is no article found' }, { status: 404 });
        }

        const deletedArticle = await prisma.article.delete({
            where: {
                id: articleId
            }
        });

        return NextResponse.json({ deletedArticle, message: 'article deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}