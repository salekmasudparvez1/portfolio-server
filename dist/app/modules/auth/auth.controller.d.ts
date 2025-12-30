import { Request, Response } from 'express';
export declare const authController: {
    signup: (req: Request, res: Response, next: import("express").NextFunction) => void;
    resendVerificationCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verificationUserCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getProfileInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    status: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateName: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map