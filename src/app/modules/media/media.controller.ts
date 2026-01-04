import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MediaService } from "./media.service";

const createMedia = catchAsync(async (req, res) => {
  const result = await MediaService.createMedia(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Media created successfully",
    data: result,
  });
});

const getAllMedia = catchAsync(async (req, res) => {
  const result = await MediaService.getAllMedia(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const getMediaById = catchAsync(async (req, res) => {
  const result = await MediaService.getMediaById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const getMediaByPublicId = catchAsync(async (req, res) => {
  const result = await MediaService.getMediaByPublicId(req.params.public_id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const getAllFolders = catchAsync(async (req, res) => {
  const result = await MediaService.getAllFolders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folders retrieved successfully",
    data: result,
  });
});

const getMediaByFolder = catchAsync(async (req, res) => {
  const result = await MediaService.getMediaByFolder(req.params.folder as string, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const updateMedia = catchAsync(async (req, res) => {
  const result = await MediaService.updateMedia(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media updated successfully",
    data: result,
  });
});

const deleteMedia = catchAsync(async (req, res) => {
  await MediaService.deleteMedia(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media deleted successfully",
    data: null,
  });
});

const deleteMediaByPublicId = catchAsync(async (req, res) => {
  await MediaService.deleteMediaByPublicId(req.params.public_id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media deleted successfully",
    data: null,
  });
});

export const MediaController = {
  createMedia,
  getAllMedia,
  getMediaById,
  getMediaByPublicId,
  getAllFolders,
  getMediaByFolder,
  updateMedia,
  deleteMedia,
  deleteMediaByPublicId,
};
