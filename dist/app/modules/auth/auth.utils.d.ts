import jwt from "jsonwebtoken";
import { TJwtPayload } from "./auth.interface";
export declare const generateToken: (payload: TJwtPayload, secret: string, expired: string) => string;
export declare const verifyToken: (token: string, secret: string) => jwt.JwtPayload;
//# sourceMappingURL=auth.utils.d.ts.map