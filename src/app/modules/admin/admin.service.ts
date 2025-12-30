import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Auth } from "../auth/auth.model";



const getAllUsersFunc = async (req: any) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const data = await Auth.find({ role: { $ne: 'admin' } }).skip(skip).limit(limit);
  const total = await Auth.countDocuments({ role: { $ne: 'admin' } });
  return {
    data,
    meta: {
      page,
      limit,
      total,
    }
  };
}
const deleteUserFunc = async (userId: string) => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user?.role === "admin") {
    throw new AppError(StatusCodes.FORBIDDEN, `Admin's can not be deleted`)
  }
  const res = await Auth.findByIdAndDelete(userId);
  return res;
}

const updateRoleFunc = async (userId: string, role: string) => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user?.role === "admin") {
    throw new AppError(StatusCodes.FORBIDDEN, `Admin's role can not be changed`)
  };
  const res = await Auth.findByIdAndUpdate(userId, { role });
  return res;
}
export const adminService = {
 getAllUsersFunc,
 deleteUserFunc,
 updateRoleFunc
};
