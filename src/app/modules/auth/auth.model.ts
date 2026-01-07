import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { IUserCreate, TSignupModel } from './auth.interface';
import config from '../../config';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';



const authSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    signInMethod: { type: String, enum: ['email', 'google', 'github', 'unknown'], required: false, default: 'email' },
    phoneNumber: { type: String, unique: true, default: null },
    password: { type: String, select: false, default: null },
    role: { type: String, enum: ['admin', 'user'], required: true },
    isBlocked: { type: Boolean, default: false, required: true },
    subscriptionPlan: { type: String, enum: ['free', 'premium'], default: 'free' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    photoURL: { type: String, required: true },
    region: { type: String, required: true },
    device: { type: String, required: true },
    bio: { type: String, default: '', maxLength: 500 },

    isEmailVerified: { type: Boolean, default: false },
    emailVerifyCode: String,
    emailVerifyExpire: Date
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users',
  },
);
authSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
});


authSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
authSchema.statics.isUserExistsByCustomId = async function (email: string) {
  return await Auth.findOne({ email }).select('+password');
};

export const Auth = mongoose.model<IUserCreate, TSignupModel>('user', authSchema);