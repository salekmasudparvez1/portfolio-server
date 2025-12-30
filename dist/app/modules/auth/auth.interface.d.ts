import { Document, Model, Types } from 'mongoose';
export interface IUserCreate extends Document {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    password?: string;
    role: 'admin' | 'user';
    isBlocked: boolean;
    photoURL: string;
    region: string;
    status: 'pending' | 'approved' | 'rejected';
    subscriptionPlan: 'free' | 'premium';
    isEmailVerified: boolean;
    emailVerifyCode?: string;
    emailVerifyExpire?: Date;
}
export type TSignupModel = Model<IUserCreate> & {
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    isUserExistsByCustomId(email: string): Promise<IUserCreate | null>;
};
export type TLoginUser = {
    email: string;
    password: string;
};
export interface TJwtPayload {
    email: string;
    role: "admin" | "user";
}
export interface IJwtPayload extends Document {
    id: Types.ObjectId;
    email: string;
    role: 'admin' | 'landlord' | 'tenant';
    iat: number;
    exp: number;
}
//# sourceMappingURL=auth.interface.d.ts.map