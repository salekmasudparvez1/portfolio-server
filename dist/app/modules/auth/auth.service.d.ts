import { IRegisterDoc, IUserCreate } from './auth.interface';
import mongoose from 'mongoose';
interface TUpdateDoc {
    id: string;
    action: string;
}
export declare const authService: {
    signupFunc: (registrationDoc: IRegisterDoc) => Promise<{
        accessToken: string;
        refreshToken: string;
        userInfo: {
            username: string;
            name: string;
            email: string;
            isEmailVerified: boolean;
            role: "admin" | "user";
            photoURL: string;
            isBlocked: boolean;
            status: "pending" | "approved" | "rejected";
            phoneNumber: string;
        };
    }>;
    loginFunc: (payload: any) => Promise<{
        accessToken: string;
        refreshToken: string;
        userInfo: {
            username: string;
            email: string;
            role: "admin" | "user";
            photoURL: string;
        };
    }>;
    getProfileInfoFunc: (req: Request) => Promise<IUserCreate & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateUserFunc: (payload: IUserCreate) => Promise<mongoose.UpdateWriteOpResult>;
    statusFuc: (payload: TUpdateDoc) => Promise<(mongoose.Document<unknown, {}, IUserCreate, {}, mongoose.DefaultSchemaOptions> & IUserCreate & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null | undefined>;
    updatePasswordFunc: (payload: any) => Promise<mongoose.UpdateWriteOpResult>;
    getSingleUserFunc: (email: string) => Promise<(mongoose.Document<unknown, {}, IUserCreate, {}, mongoose.DefaultSchemaOptions> & IUserCreate & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateNameFunc: (payload: any) => Promise<{
        name: any;
    } | {
        name?: never;
    }>;
    resendVerificationCodeFunc: (email: string) => Promise<{
        success: boolean;
    }>;
    verificationUserCodeFunc: (email: string, emailVerifyCode: string) => Promise<IUserCreate | null>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map