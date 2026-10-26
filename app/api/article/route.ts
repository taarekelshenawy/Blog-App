import { NextResponse,NextRequest } from "next/server";
import {PrismaClient} from '@prisma/client';
import { AtricleValidationSchema } from "@/utils/ValidationSchema";



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

export async function GET(request:NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = Number(searchParams.get('limit') || 5);
        const pageNumber = Number(searchParams.get("page") || 1);
      const skip = (limit * (pageNumber - 1));

    const [newArticle, totalCount] = await Promise.all([
      prisma.article.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', 
        },
      }),
      prisma.article.count(), 
    ]);


    const totalPages = Math.ceil(totalCount / limit);

    
    return NextResponse.json(
      {
        data: newArticle,
        pagination: {
          currentPage: pageNumber,
          limit: limit,
          totalCount: totalCount,
          totalPages: totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      },
      { status: 200 }
    );

    } catch{

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


