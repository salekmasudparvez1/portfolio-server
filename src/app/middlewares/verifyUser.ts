import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

import { IJwtPayload } from '../modules/auth/auth.interface';
import { Auth } from '../modules/auth/auth.model';

const verifyUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    const token = bearerToken?.split(" ")[1];
  
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! ');
    }

    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email } = decoded;
    const user = await Auth.isUserExistsByCustomId(email);
    const id = user?._id;

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    const isBlock = user?.isBlocked
    
    if (isBlock) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !🤮');
    }
  
    if (role === "user" || role === "admin" ) {

        // Use a safe cast to attach custom props without fighting typings
        (req as any).user = decoded as IJwtPayload;
        (req as any).userId = id;
        next();
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized 😑!',
        );
    }


});


export default verifyUser;
