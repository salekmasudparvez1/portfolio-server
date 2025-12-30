import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { TJwtPayload } from "./auth.interface";

export const generateToken = (payload:TJwtPayload,secret:string,expired:string)=>{
    const options: SignOptions = { expiresIn: expired as any };
    const token = jwt.sign(payload, secret, options);
    return token;
}
export const verifyToken = (token: string, secret: string) => {
    const isVerfied = jwt.verify(token, secret) as JwtPayload;
    return isVerfied
  };