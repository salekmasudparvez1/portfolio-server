import { Document, Model, Types } from 'mongoose';
export interface IUserCreate extends Document {
    name: string;
    username: string;
    email: string;
    signInMethod?: 'email' | 'google' | 'github' | 'unknown';
    phoneNumber: string;
    password?: string | null;
    role: 'admin' | 'user';
    isBlocked: boolean;
    photoURL: string;
    status: 'pending' | 'approved' | 'rejected';
    subscriptionPlan: 'free' | 'premium';
    region?: string;
    device?: string;
    bio?: string;
    isEmailVerified: boolean;
    emailVerifyCode?: string;
    emailVerifyExpire?: Date;
}
export type IRegisterDoc = Pick<IUserCreate, 'name' | 'username' | 'email' | 'phoneNumber' | 'password' | 'isBlocked' | 'photoURL' | 'role' | 'emailVerifyCode' | 'emailVerifyExpire' | 'isEmailVerified' | 'region' | 'device' | 'signInMethod'>;
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