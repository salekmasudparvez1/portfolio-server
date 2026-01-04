"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const media_model_1 = require("./media.model");
const createMedia = async (payload) => {
    // Check if public_id already exists
    const existingMedia = await media_model_1.Media.findOne({ public_id: payload.public_id });
    if (existingMedia) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Media with this public_id already exists");
    }
    const result = await media_model_1.Media.create(payload);
    return result;
};
const getAllMedia = async (query) => {
    const { folder, format, tags, search, page = 1, limit = 20, sort = "-createdAt", } = query;
    const filter = {};
    // Filter by folder
    if (folder)
        filter.folder = folder;
    // Filter by format
    if (format)
        filter.format = format;
    // Filter by tags
    if (tags)
        filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    // Search in filename and public_id
    if (search) {
        filter.$or = [
            { filename: { $regex: search, $options: "i" } },
            { public_id: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [media, total] = await Promise.all([
        media_model_1.Media.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        media_model_1.Media.countDocuments(filter),
    ]);
    return {
        media,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getMediaById = async (id) => {
    const result = await media_model_1.Media.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media not found");
    }
    return result;
};
const getMediaByPublicId = async (public_id) => {
    const result = await media_model_1.Media.findOne({ public_id });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media not found");
    }
    return result;
};
const getAllFolders = async () => {
    // Get distinct folder names
    const folders = await media_model_1.Media.distinct("folder");
    return folders;
};
const getMediaByFolder = async (folder, query) => {
    const { page = 1, limit = 20, sort = "-createdAt", } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const [media, total] = await Promise.all([
        media_model_1.Media.find({ folder })
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        media_model_1.Media.countDocuments({ folder }),
    ]);
    return {
        media,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const updateMedia = async (id, payload) => {
    const result = await media_model_1.Media.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media not found");
    }
    return result;
};
const deleteMedia = async (id) => {
    const result = await media_model_1.Media.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media not found");
    }
    return result;
};
const deleteMediaByPublicId = async (public_id) => {
    const result = await media_model_1.Media.findOneAndDelete({ public_id });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Media not found");
    }
    return result;
};
exports.MediaService = {
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
//# sourceMappingURL=media.service.js.map