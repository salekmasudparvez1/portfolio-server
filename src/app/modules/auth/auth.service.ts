import { IRegisterDoc, IUserCreate, TLoginUser } from './auth.interface';

import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import generateCodeVarification from '../../utils/generateCodeVarification';
import { sendVerificationCodeEmail } from '../../utils/sendEmail';
import { Auth } from './auth.model';

const signupFunc = async (registrationDoc: IRegisterDoc) => {
  // 1. Role validation: only allow 'admin' signup when a valid admin key is provided
  if (registrationDoc?.role === 'admin') {
    const providedKey = (registrationDoc as any).adminKey;


    // If the server hasn't configured an admin key, signal that admin registration is disabled
    if (!config.ADMIN_REGISTRATION_KEY) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Admin registration is disabled on this server. Set ADMIN_REGISTRATION_KEY in the environment to enable it.'
      );
    }
    if (!providedKey || providedKey !== config.ADMIN_REGISTRATION_KEY) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Admin registration is not allowed');
    }
    // Optionally remove adminKey from the doc before storing
    delete (registrationDoc as any).adminKey;
  }

  // 2. Username validation
  if (!registrationDoc.username) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Username is required');
  }
  registrationDoc.username = registrationDoc.username.trim();
  if (/\s/.test(registrationDoc.username)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Username cannot contain whitespace');
  }

  // 3. Email validation
  if (!registrationDoc.email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registrationDoc.email)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid email format');
  }

  // 4. Phone number validation
  if (!registrationDoc.phoneNumber) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Phone number is required');
  }
  const phoneRegex = /^\+?\d{10,15}$/; // optional +, 10-15 digits
  if (!phoneRegex.test(registrationDoc.phoneNumber.toString())) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid phone number');
  }

  // 5. Check uniqueness in a single DB query
  const existing = await Auth.findOne({
    $or: [
      { username: registrationDoc.username },
      { email: registrationDoc.email },
      { phoneNumber: registrationDoc.phoneNumber }
    ]
  });

  if (existing) {
    if (existing.username === registrationDoc.username) {
      throw new AppError(StatusCodes.CONFLICT, 'Username already exists');
    }
    if (existing.email === registrationDoc.email) {
      throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
    }
    if (existing.phoneNumber === registrationDoc.phoneNumber) {
      throw new AppError(StatusCodes.CONFLICT, 'Phone number already exists');
    }
  }
  const { code, expires } = generateCodeVarification();

  // Persist the verification code and expiry on the user document
  registrationDoc.emailVerifyCode = code;
  registrationDoc.emailVerifyExpire = expires;

  // 7. Create user
  const res = await Auth.create(registrationDoc);

  // send verification email (non-blocking for signup, but surface errors if they occur)
  try {
    const sendResult = await sendVerificationCodeEmail(registrationDoc.email, code, registrationDoc.name);
    console.info("✅ Verification email send result during signup:", sendResult);
  } catch (err) {
    console.error("❌ Verification email failed to send during signup:", err);
    // optionally decide whether to fail signup — currently we log and continue
  }

  // 8. JWT payload
  const jwtPayload = {
    id: res._id,
    email: res?.email,
    name: res?.name,
    userName: res?.username,
    role: res?.role,
    isBlocked: res?.isBlocked,
    subscriptionPlan: res?.subscriptionPlan,
    status: res?.status,
    photoURL: res?.photoURL,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // 9. Return response
  return {
    accessToken,
    refreshToken,
    userInfo: {
      username: res.username,
      name: res.name,
      email: res.email,
      isEmailVerified: res.isEmailVerified,
      role: res.role,
      photoURL: res.photoURL,
      isBlocked: res.isBlocked,
      status: res.status,
      phoneNumber: res.phoneNumber,
    },
  };
};

// Helper to safely build a case-insensitive exact-match RegExp from arbitrary input
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
* Allow login using either username OR email + password.
* - Accepts payload.email or payload.username or payload.identifier (preferred generic name).
* - Performs case-insensitive lookup for both username and email.
*/


const loginFunc = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Validate input
    const rawIdentifier =
      (payload?.identifier ?? payload?.email ?? payload?.username)?.toString().trim();
    const password = payload?.password;

    if (!rawIdentifier || !password) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Identifier (email or username) and password are required'
      );
    }

    // 2️⃣ Safe query: case-insensitive search
    const safe = escapeRegExp(rawIdentifier);
    const query = {
      $or: [
        { email: new RegExp(`^${safe}$`, 'i') },
        { username: new RegExp(`^${safe}$`, 'i') },
      ],
    };

    const user = await Auth.findOne(query).select('+password').session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found 😒');
    }

    // if (!user.isEmailVerified) {
    //   throw new AppError(StatusCodes.FORBIDDEN, 'User email is not verified');
    // }

    if (user.isBlocked) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked 🤡');
    }

    if (user.password === undefined) {

      throw new AppError(StatusCodes.FORBIDDEN, 'User is not valid 🚫');
    }

    // 3️⃣ Verify password
    const isPasswordValid = await Auth.isPasswordMatched(password, user?.password);
    if (!isPasswordValid) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Incorrect Password 😵‍💫');
    }

    // 4️⃣ Prepare JWT payload (convert ObjectId to string)
    const jwtPayload = {
      id: user?._id?.toString(),
      email: user?.email,
      role: user?.role,
      userName: user?.username,
      name: user?.name,
      isEmailVerified: user?.isEmailVerified,
      isBlocked: user?.isBlocked,
      subscriptionPlan: user?.subscriptionPlan,
      status: user?.status,
      photoURL: user?.photoURL,
    };

    // 5️⃣ Ensure secrets exist
    if (!config.jwt_access_secret || !config.jwt_refresh_secret) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT secrets are not configured');
    }

    // 6️⃣ Generate tokens safely
    let accessToken: string;
    let refreshToken: string;
    try {
      accessToken = generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
      );
      refreshToken = generateToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
      );
    } catch (err) {
      console.error('JWT generation error:', err);
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate tokens');
    }

    // 7️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 8️⃣ Return response
    return {
      accessToken,
      refreshToken,
      userInfo: {
        username: user.username,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
      },
    };
  } catch (error) {
    // 9️⃣ Rollback transaction safely
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateUserFunc = async (payload: IUserCreate) => {

  const user = await Auth.findOne({ email: payload?.email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const res = await Auth.updateOne({ email: payload?.email },
    payload)
  return res;
}
interface TUpdateDoc {
  id: string,
  action: string
}


const getProfileInfoFunc = async (req: Request) => {
  const payload = (req as any).user
  if (!payload?.email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }
  const user = await Auth.findOne({ email: payload?.email }).lean().select('-password -emailVerifyCode ');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user?.isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Account is blocked');
  }

  return user;
}

const statusFuc = async (payload: TUpdateDoc) => {
  const users = await Auth.findById(payload?.id);
  if (!users) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (users?.role === "admin") {
    throw new AppError(StatusCodes.FORBIDDEN, `Admin's status can not be changed`)
  }
  if (!payload?.action) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid action')
  }
  if (payload?.action === 'block') {
    const res = await Auth.findByIdAndUpdate(payload?.id, { isBlocked: true });
    return res;
  }
  if (payload?.action === 'active') {
    const res = await Auth.findByIdAndUpdate(payload?.id, { isActive: true });
    return res;
  }
  if (payload?.action === 'deactive') {
    const res = await Auth.findByIdAndUpdate(payload?.id, { isActive: false });
    return res;
  }

}
const updatePasswordFunc = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await Auth.findOne({ email: payload?.email }).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!user?.password) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User has no password set');
    }

    const isMatchPassword = await bcrypt.compare(payload?.cpassword, user?.password);
    if (!isMatchPassword) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Incorrect current password');
    }

    const newpass = await bcrypt.hash(
      payload?.npassword,
      Number(config.bcrypt_salt_rounds)
    );
    if (!newpass) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error in password hash');
    }

    const res = await Auth.updateOne({ email: payload?.email }, { password: newpass }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getSingleUserFunc = async (email: string) => {

  const res = await Auth.findOne({ email });
  return res
};
const updateNameFunc = async (payload: any) => {

  if (!payload?.email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }
  if (!payload?.name) {
    throw new AppError(StatusCodes.NO_CONTENT, "NO name found")
  }
  try {

    const data = await Auth.updateOne({ email: payload?.email }, {
      $set: {
        name: payload?.name
      }
    })
    const result = data?.modifiedCount > 0 ? { name: payload?.name } : {}
    return result;
  } catch (error) {

    throw new AppError(StatusCodes.BAD_REQUEST, 'Can not update Profile');
  }
};

// Resend verification code function with rate limiting
const resendVerificationCodeFunc = async (email: string) => {
  const user = await Auth.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user?.isEmailVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is already verified');
  }

  const now = Date.now();
  const expireTimeRaw = user.emailVerifyExpire;
  if (!expireTimeRaw) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No verification code to resend');
  }

  const expireTime = new Date(expireTimeRaw).getTime();
  if (isNaN(expireTime)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid verification code expiry');
  }

  // Check if the code has expired
  if (now > expireTime) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code has expired');
  }
  // Generate new verification code and expiry
  const { code, expires } = generateCodeVarification();

  // Update user: code, expiry, last sent time
  await Auth.findOneAndUpdate(
    { email },
    {
      emailVerifyCode: code,
      emailVerifyExpire: expires,
      lastVerificationSentAt: new Date()
    }
  );

  try {
    await sendVerificationCodeEmail(email, code, user.name);
    return { success: true };
  } catch (err) {
    console.error("❌ Failed to resend verification code:", err);
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send verification email');
  }
};

const verificationUserCodeFunc = async (email: string, emailVerifyCode: string) => {
  const user: IUserCreate | null = await Auth.findOne({
    email,
  })
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user?.isEmailVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is already verified');
  }
  if (user?.emailVerifyCode !== emailVerifyCode) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid verification code');
  }
  if (!user?.emailVerifyExpire) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code has expired');
  }

  const expireTime = new Date(user.emailVerifyExpire).getTime();
  const now = Date.now();

  // Check if the code has expired
  if (now > expireTime) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code has expired');
  }



  const updatedUser: IUserCreate | null = await Auth.findOneAndUpdate(
    { email },
    {
      isEmailVerified: true,
      emailVerifyCode: null,
      emailVerifyExpire: null
    },
    { new: true }
  );
  return updatedUser;
}

export const authService = {
  signupFunc,
  loginFunc,
  getProfileInfoFunc,
  updateUserFunc,
  statusFuc,
  updatePasswordFunc,
  getSingleUserFunc,
  updateNameFunc,
  resendVerificationCodeFunc,
  verificationUserCodeFunc,
};
