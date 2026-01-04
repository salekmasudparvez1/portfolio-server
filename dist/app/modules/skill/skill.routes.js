"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const skill_controller_1 = require("./skill.controller");
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const skill_validations_1 = require("./skill.validations");
const router = (0, express_1.Router)();
// Public routes
router.get("/", skill_controller_1.SkillController.getAllSkills);
router.get("/:id", skill_controller_1.SkillController.getSkillById);
// Admin protected routes
router.post("/", verifyAdmin_1.default, (0, validateRequest_1.default)(skill_validations_1.SkillValidations.createSkillValidation), skill_controller_1.SkillController.createSkill);
router.patch("/:id", verifyAdmin_1.default, (0, validateRequest_1.default)(skill_validations_1.SkillValidations.updateSkillValidation), skill_controller_1.SkillController.updateSkill);
router.delete("/:id", verifyAdmin_1.default, skill_controller_1.SkillController.deleteSkill);
exports.SkillRouter = router;
//# sourceMappingURL=skill.routes.js.map