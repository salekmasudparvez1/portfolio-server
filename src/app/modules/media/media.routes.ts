import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { MediaController } from "./media.controller";
import verifyAdmin from "../../middlewares/verifyAdmin";
import { MediaValidations } from "./media.validations";

const router = Router();

// Public routes
router.get("/", MediaController.getAllMedia);
router.get("/folders", MediaController.getAllFolders);
router.get("/folder/:folder", MediaController.getMediaByFolder);
router.get("/public/:public_id", MediaController.getMediaByPublicId);
router.get("/:id", MediaController.getMediaById);

// Admin protected routes
router.post(
  "/",
  verifyAdmin,
  validateRequest(MediaValidations.createMediaValidation),
  MediaController.createMedia
);

router.patch(
  "/:id",
  verifyAdmin,
  validateRequest(MediaValidations.updateMediaValidation),
  MediaController.updateMedia
);

router.delete("/:id", verifyAdmin, MediaController.deleteMedia);
router.delete("/public/:public_id", verifyAdmin, MediaController.deleteMediaByPublicId);

export const MediaRouter = router;
