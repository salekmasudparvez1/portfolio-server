import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import verifyAdmin from '../../middlewares/verifyAdmin';
import { adminController } from './admin.controller';
import { updateRoleValidationSchema } from './admin.validations';


const adminRouter = Router();

adminRouter.get('/users', verifyAdmin, adminController.getAllUsers);
adminRouter.delete('/user/:id', verifyAdmin, adminController.deleteUser);
adminRouter.put('/users/:id', verifyAdmin, validateRequest(updateRoleValidationSchema), adminController.updateRole);


export default adminRouter;
