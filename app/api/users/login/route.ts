import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/utils/ValidationSchema';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';// تأكد أن هذا يوافق طريقة استيرادك لـ Prisma في مشروعك


const prisma = new PrismaClient();
type LoginFormData = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginFormData;
    
  
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.format() }, 
        { status: 400 }
      );
    }

 
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

  
    if (!user) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

   
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

   
    return NextResponse.json(
      { 
        message: 'تم تسجيل الدخول بنجاح',
        user: { id: user.id, username:user.username, email: user.email }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}