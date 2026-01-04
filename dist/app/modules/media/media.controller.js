"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const media_service_1 = require("./media.service");
const createMedia = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.createMedia(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Media created successfully",
        data: result,
    });
});
const getAllMedia = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.getAllMedia(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media retrieved successfully",
        data: result,
    });
});
const getMediaById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.getMediaById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media retrieved successfully",
        data: result,
    });
});
const getMediaByPublicId = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.getMediaByPublicId(req.params.public_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media retrieved successfully",
        data: result,
    });
});
const getAllFolders = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.getAllFolders();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Folders retrieved successfully",
        data: result,
    });
});
const getMediaByFolder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.getMediaByFolder(req.params.folder, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media retrieved successfully",
        data: result,
    });
});
const updateMedia = (0, catchAsync_1.default)(async (req, res) => {
    const result = await media_service_1.MediaService.updateMedia(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media updated successfully",
        data: result,
    });
});
const deleteMedia = (0, catchAsync_1.default)(async (req, res) => {
    await media_service_1.MediaService.deleteMedia(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media deleted successfully",
        data: null,
    });
});
const deleteMediaByPublicId = (0, catchAsync_1.default)(async (req, res) => {
    await media_service_1.MediaService.deleteMediaByPublicId(req.params.public_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Media deleted successfully",
        data: null,
    });
});
exports.MediaController = {
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
//# sourceMappingURL=media.controller.js.map