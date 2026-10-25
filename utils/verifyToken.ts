
import { NextRequest, NextResponse } from "next/server";

import jwt , {JwtPayload} from 'jsonwebtoken';



export default function verifyToken(request:NextRequest) {

       const token = request.cookies.get("token")?.value as string;
         const decoded =jwt.verify(token,process.env.SECRET_KEY as string) as JwtPayload;
       
           if(!decoded){
               return NextResponse.json({ message: 'There is no user found with this id' }, { status: 404 })
           }
       
  return decoded.id;
}
