import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

type JwtPayload = {
        id:number,
      email:string,
      username:string,
}

export default function verifyToken(request: NextRequest): JwtPayload | NextResponse {
    // 1. جلب التوكن من الـ Cookies
    const token = request.cookies.get("token")?.value;

    // 2. التحقق من وجود التوكن أصلاً
    if (!token) {
        return NextResponse.json({ message: 'No token provided, access denied' }, { status: 401 });
    }

    try {
        // 3. محاولة فك التوكن والتحقق منه
        const userPayload = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
        
        return userPayload;
    } catch  {
        // 4. في حال كان التتوكن منتهي الصلاحية أو غير صالح
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}

