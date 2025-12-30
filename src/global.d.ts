import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { role?: string };
      userId?: Types.ObjectId;
    }
  }
}

export {};
