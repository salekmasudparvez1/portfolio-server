import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SkillController } from "./skill.controller";
import verifyAdmin from "../../middlewares/verifyAdmin";
import { SkillValidations } from "./skill.validations";

const router = Router();

// Public routes
router.get("/", SkillController.getAllSkills);
router.get("/:id", SkillController.getSkillById);

// Admin protected routes
router.post(
  "/",
  verifyAdmin,
  validateRequest(SkillValidations.createSkillValidation),
  SkillController.createSkill
);

router.patch(
  "/:id",
  verifyAdmin,
  validateRequest(SkillValidations.updateSkillValidation),
  SkillController.updateSkill
);

router.delete("/:id", verifyAdmin, SkillController.deleteSkill);

export const SkillRouter = router;
