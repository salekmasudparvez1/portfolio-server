import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ISkill } from "./skill.interface";
import { Skill } from "./skill.model";

const createSkill = async (payload: ISkill) => {
  // Check if skill category name already exists
  const existingSkill = await Skill.findOne({ name: payload.name });
  if (existingSkill) {
    throw new AppError(httpStatus.CONFLICT, "Skill category with this name already exists");
  }

  const result = await Skill.create(payload);
  return result;
};

const getAllSkills = async (query: Record<string, any>) => {
  const {
    type,
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const filter: Record<string, any> = {};

  // Filter by type
  if (type) filter.type = type;

  // Search in name and description
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [skills, total] = await Promise.all([
    Skill.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Skill.countDocuments(filter),
  ]);

  return {
    skills,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getSkillById = async (id: string) => {
  const result = await Skill.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill not found");
  }
  return result;
};

const updateSkill = async (id: string, payload: Partial<ISkill>) => {
  // If name is being updated, check for duplicates
  if (payload.name) {
    const existingSkill = await Skill.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (existingSkill) {
      throw new AppError(httpStatus.CONFLICT, "Skill category with this name already exists");
    }
  }

  const result = await Skill.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill not found");
  }

  return result;
};

const deleteSkill = async (id: string) => {
  const result = await Skill.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill not found");
  }
  return result;
};

export const SkillService = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
