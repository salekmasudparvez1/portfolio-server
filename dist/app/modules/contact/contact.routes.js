"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_controller_1 = require("./contact.controller");
const verifyAdmin_1 = __importDefault(require("../../middlewares/verifyAdmin"));
const contact_validations_1 = require("./contact.validations");
const router = (0, express_1.Router)();
// Public route - anyone can submit contact form
router.post("/", (0, validateRequest_1.default)(contact_validations_1.ContactValidations.createContactValidation), contact_controller_1.ContactController.createContact);
// Admin protected routes
router.get("/", verifyAdmin_1.default, contact_controller_1.ContactController.getAllContacts);
router.get("/:id", verifyAdmin_1.default, contact_controller_1.ContactController.getContactById);
router.patch("/:id", verifyAdmin_1.default, (0, validateRequest_1.default)(contact_validations_1.ContactValidations.updateContactValidation), contact_controller_1.ContactController.updateContact);
router.delete("/:id", verifyAdmin_1.default, contact_controller_1.ContactController.deleteContact);
exports.ContactRouter = router;
//# sourceMappingURL=contact.routes.js.map