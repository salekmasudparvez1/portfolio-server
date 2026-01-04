"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const media_controller_1 = require("./media.controller");
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const media_validations_1 = require("./media.validations");
const router = (0, express_1.Router)();
// Public routes
router.get("/", media_controller_1.MediaController.getAllMedia);
router.get("/folders", media_controller_1.MediaController.getAllFolders);
router.get("/folder/:folder", media_controller_1.MediaController.getMediaByFolder);
router.get("/public/:public_id", media_controller_1.MediaController.getMediaByPublicId);
router.get("/:id", media_controller_1.MediaController.getMediaById);
// Admin protected routes
router.post("/", verifyAdmin_1.default, (0, validateRequest_1.default)(media_validations_1.MediaValidations.createMediaValidation), media_controller_1.MediaController.createMedia);
router.patch("/:id", verifyAdmin_1.default, (0, validateRequest_1.default)(media_validations_1.MediaValidations.updateMediaValidation), media_controller_1.MediaController.updateMedia);
router.delete("/:id", verifyAdmin_1.default, media_controller_1.MediaController.deleteMedia);
router.delete("/public/:public_id", verifyAdmin_1.default, media_controller_1.MediaController.deleteMediaByPublicId);
exports.MediaRouter = router;
//# sourceMappingURL=media.routes.js.map