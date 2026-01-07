import { Router } from "express";
import { authController } from "./auth.controller";
import verifyAdmin from "../../middlewares/verifyAdmin";
import { loginValidationSchema, signupValidationSchema } from "./auth.validations";
import validateRequest from "../../middlewares/validateRequest";
import verifyUser from "../../middlewares/verifyUser";


const authRouter = Router()
authRouter.post('/signup', validateRequest(signupValidationSchema), authController.signup);//email
authRouter.post('/signup-with-provider', authController.signupWithProvider);
authRouter.post('/sign-in-with-provider', authController.signInWithProvider);
authRouter.post('/resend-verification-code',verifyUser, authController.resendVerificationCode);
authRouter.post('/verify-user-code', verifyUser,authController.verificationUserCode);

authRouter.post('/login', validateRequest(loginValidationSchema), authController.login);
authRouter.get('/profile',verifyUser ,authController.getProfileInfo);

authRouter.patch('/update-user/:id',verifyAdmin, authController.updateUser);
authRouter.get('/getSingle/:email', authController.getSingleUser);
authRouter.patch('/update',verifyAdmin, authController.status);
authRouter.patch('/update/user', authController.updateName);
authRouter.put('/update/password',verifyUser, authController.updatePassword);

export default authRouter;