import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authService } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import StatusCodes from 'http-status-codes';
import config from '../../config';
import { IRegisterDoc } from './auth.interface';


const signup = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const getDoc = {
    name: data?.name,
    username: data?.username,
    email: data?.email,
    phoneNumber: data?.phoneNumber,
    password: data?.password,
    role: data?.role || "user",
    photoURL: data?.photoURL || "https://res.cloudinary.com/dncnvqrc6/image/upload/v1740454884/untitled.png",
    isBlocked: false,
    region: data?.region || "Not Specified",
    device: data?.device || "Not Specified",
    isEmailVerified: false,
  };

  const result = await authService.signupFunc(getDoc as IRegisterDoc);

  sendResponse(res, {
    success: true,
    message: 'User sign up successfully',
    data: result,
    statusCode: StatusCodes.ACCEPTED,
  });
});
const resendVerificationCode = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.resendVerificationCodeFunc(email);
  sendResponse(res, {
    success: true,
    message: 'Verification code resent successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const verificationUserCode = catchAsync(async (req: Request, res: Response) => {
  const { email, emailVerifyCode } = req.body;
  const result = await authService.verificationUserCodeFunc(email, emailVerifyCode);
  sendResponse(res, {
    success: true,
    message: 'User verified successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginFunc(req.body);
  const {  refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    success: true,
    message: 'User logged in successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.getProfileInfoFunc(req as any);
  sendResponse(res, {
    success: true,
    message: 'User profile fetched successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});





const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedData = req.body;
  const result = await authService.updateUserFunc(updatedData);
  sendResponse(res, {
    success: true,
    message: 'User updated successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const status = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.statusFuc(req?.body);
  sendResponse(res, {
    success: true,
    message: 'Updated user status ',
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const getUpdateInfo = req.body;
  const result = await authService.updatePasswordFunc(getUpdateInfo);
  sendResponse(res, {
    success: true,
    message: 'Updated user password ',
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const getUserInfo = req.params.email as string;
  const result = await authService.getSingleUserFunc(getUserInfo);
  sendResponse(res, {
    success: true,
    message: 'Updated user profile ',
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const updateName = catchAsync(async (req: Request, res: Response) => {
  const getUserInfo = req.body;

  const result = await authService.updateNameFunc({
    name: getUserInfo?.name,
    email: getUserInfo?.email,
  });
  sendResponse(res, {
    success: true,
    message: 'Updated user profile ',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

export const authController = {
  signup,
  resendVerificationCode,
  verificationUserCode,
  login,
  getProfileInfo,
  updateUser,



  status,
  updatePassword,
  getSingleUser,
  updateName,
};
