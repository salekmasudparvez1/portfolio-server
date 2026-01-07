"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const contact_service_1 = require("./contact.service");
const createContact = (0, catchAsync_1.default)(async (req, res) => {
    const result = await contact_service_1.ContactService.createContact(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Contact submitted successfully",
        data: result,
    });
});
const getAllContacts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await contact_service_1.ContactService.getAllContacts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contacts retrieved successfully",
        data: result,
    });
});
const getContactById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await contact_service_1.ContactService.getContactById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact retrieved successfully",
        data: result,
    });
});
const updateContact = (0, catchAsync_1.default)(async (req, res) => {
    const result = await contact_service_1.ContactService.updateContact(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact updated successfully",
        data: result,
    });
});
const deleteContact = (0, catchAsync_1.default)(async (req, res) => {
    const result = await contact_service_1.ContactService.deleteContact(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact deleted successfully",
        data: result,
    });
});
exports.ContactController = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
};
//# sourceMappingURL=contact.controller.js.map