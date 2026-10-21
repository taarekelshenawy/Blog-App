import jwt from 'jsonwebtoken';

type JwtPayloadData={
    id:number,
    email:string,
    username:string | null,
}

export function generateToken(jwtPayload:JwtPayloadData){
    const  privateKey =process.env.SECRET_KEY as string;
    const token = jwt.sign(jwtPayload, privateKey, { expiresIn: '1h' });
    return token;
}