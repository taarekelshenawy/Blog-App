import { NextResponse,NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    const token = request.headers.get('authToken') as string;
    if(!token){
        return NextResponse.json({message: "Unauthorized: No token provided"},{status:401})
    }

  return NextResponse.next();
}

export const config = {
  matcher: [ '/api/users/profile/:path*'],
};