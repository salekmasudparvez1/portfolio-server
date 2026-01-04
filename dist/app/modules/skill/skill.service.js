"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const skill_model_1 = require("./skill.model");
const createSkill = async (payload) => {
    // Check if skill category name already exists
    const existingSkill = await skill_model_1.Skill.findOne({ name: payload.name });
    if (existingSkill) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Skill category with this name already exists");
    }
    const result = await skill_model_1.Skill.create(payload);
    return result;
};
const getAllSkills = async (query) => {
    const { type, search, page = 1, limit = 10, sort = "-createdAt", } = query;
    const filter = {};
    // Filter by type
    if (type)
        filter.type = type;
    // Search in name and description
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [skills, total] = await Promise.all([
        skill_model_1.Skill.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        skill_model_1.Skill.countDocuments(filter),
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
const getSkillById = async (id) => {
    const result = await skill_model_1.Skill.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Skill not found");
    }
    return result;
};
const updateSkill = async (id, payload) => {
    // If name is being updated, check for duplicates
    if (payload.name) {
        const existingSkill = await skill_model_1.Skill.findOne({
            name: payload.name,
            _id: { $ne: id },
        });
        if (existingSkill) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Skill category with this name already exists");
        }
    }
    const result = await skill_model_1.Skill.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Skill not found");
    }
    return result;
};
const deleteSkill = async (id) => {
    const result = await skill_model_1.Skill.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Skill not found");
    }
    return result;
};
exports.SkillService = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
};
//# sourceMappingURL=skill.service.js.map