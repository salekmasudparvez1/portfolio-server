import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IMedia } from "./media.interface";
import { Media } from "./media.model";

const createMedia = async (payload: IMedia) => {
  // Check if public_id already exists
  const existingMedia = await Media.findOne({ public_id: payload.public_id });
  if (existingMedia) {
    throw new AppError(httpStatus.CONFLICT, "Media with this public_id already exists");
  }

  const result = await Media.create(payload);
  return result;
};

const getAllMedia = async (query: Record<string, any>) => {
  const {
    folder,
    format,
    tags,
    search,
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = query;

  const filter: Record<string, any> = {};

  // Filter by folder
  if (folder) filter.folder = folder;
  
  // Filter by format
  if (format) filter.format = format;
  
  // Filter by tags
  if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };

  // Search in filename and public_id
  if (search) {
    filter.$or = [
      { filename: { $regex: search, $options: "i" } },
      { public_id: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [media, total] = await Promise.all([
    Media.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Media.countDocuments(filter),
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

const getMediaById = async (id: string) => {
  const result = await Media.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }
  return result;
};

const getMediaByPublicId = async (public_id: string) => {
  const result = await Media.findOne({ public_id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }
  return result;
};

const getAllFolders = async () => {
  // Get distinct folder names
  const folders = await Media.distinct("folder");
  return folders;
};

const getMediaByFolder = async (folder: string, query: Record<string, any>) => {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const [media, total] = await Promise.all([
    Media.find({ folder })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Media.countDocuments({ folder }),
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

const updateMedia = async (id: string, payload: Partial<IMedia>) => {
  const result = await Media.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }

  return result;
};

const deleteMedia = async (id: string) => {
  const result = await Media.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }
  return result;
};

const deleteMediaByPublicId = async (public_id: string) => {
  const result = await Media.findOneAndDelete({ public_id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Media not found");
  }
  return result;
};

export const MediaService = {
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
