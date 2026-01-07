import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ContactController } from "./contact.controller";
import verifyAdmin from "../../middlewares/verifyAdmin";
import { ContactValidations } from "./contact.validations";

const router = Router();

// Public route - anyone can submit contact form
router.post(
  "/",
  validateRequest(ContactValidations.createContactValidation),
  ContactController.createContact
);

// Admin protected routes
router.get("/", verifyAdmin, ContactController.getAllContacts);

router.get("/:id", verifyAdmin, ContactController.getContactById);

router.patch(
  "/:id",
  verifyAdmin,
  validateRequest(ContactValidations.updateContactValidation),
  ContactController.updateContact
);

router.delete("/:id", verifyAdmin, ContactController.deleteContact);

export const ContactRouter = router;
