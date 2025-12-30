import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { Request, Response } from "express";
import { IRoleUpdateResponse } from "./admin.interface";


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFunc(req as any);
    sendResponse(res, {
        success: true,
        message: 'All users fetched successfully',
        data: result,
        statusCode: StatusCodes.OK,
    });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const result = await adminService.deleteUserFunc(userId as any);
    sendResponse(res, {
        success: true,
        message: 'User deleted successfully',
        data: result,
        statusCode: StatusCodes.OK,
    });
});
const updateRole = catchAsync(async (req: Request, res: Response) => {
     const userId = req.params.id as string;
    const { role } = req.body;
    const result = await adminService.updateRoleFunc(userId as any, role as any) as IRoleUpdateResponse;
    sendResponse(res, {
        success: true,
        message: 'User role updated successfully',
        data: result,
        statusCode: StatusCodes.OK,
    });
});

export const adminController = {
    getAllUsers,
    deleteUser,
    updateRole
};
