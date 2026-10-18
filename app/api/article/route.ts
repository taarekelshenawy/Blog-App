import { NextResponse,NextRequest } from "next/server";
import {PrismaClient} from '@prisma/client';
import { AtricleValidationSchema } from "@/app/utils/ValidationSchema";



const prisma = new PrismaClient();

type postData={
    title:string,
    description:string,
     authorId:number,
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as postData;

        const validation = AtricleValidationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error}, { status: 400 });
        }

        const newArticle = await prisma.article.create({
            data: {
                title: body.title,
                description: body.description,
                authorId: 1,
            }
        });

        return NextResponse.json({ newArticle, message: 'article created' }, { status: 201 });

    } catch{

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}