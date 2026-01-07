import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactService } from "./contact.service";

const createContact = catchAsync(async (req, res) => {
  const result = await ContactService.createContact(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact submitted successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await ContactService.getAllContacts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts retrieved successfully",
    data: result,
  });
});

const getContactById = catchAsync(async (req, res) => {
  const result = await ContactService.getContactById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact retrieved successfully",
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const result = await ContactService.updateContact(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact updated successfully",
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const result = await ContactService.deleteContact(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact deleted successfully",
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
