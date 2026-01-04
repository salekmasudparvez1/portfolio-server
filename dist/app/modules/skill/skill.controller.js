"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const skill_service_1 = require("./skill.service");
const createSkill = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillService.createSkill(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Skill created successfully",
        data: result,
    });
});
const getAllSkills = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillService.getAllSkills(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skills retrieved successfully",
        data: result,
    });
});
const getSkillById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillService.getSkillById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skill retrieved successfully",
        data: result,
    });
});
const updateSkill = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillService.updateSkill(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skill updated successfully",
        data: result,
    });
});
const deleteSkill = (0, catchAsync_1.default)(async (req, res) => {
    await skill_service_1.SkillService.deleteSkill(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skill deleted successfully",
        data: null,
    });
});
exports.SkillController = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
};
//# sourceMappingURL=skill.controller.js.map