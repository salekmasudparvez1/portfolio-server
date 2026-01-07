"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const contact_model_1 = require("./contact.model");
const createContact = async (payload) => {
    const result = await contact_model_1.Contact.create(payload);
    return result;
};
const getAllContacts = async (query) => {
    const { status, isScheduling, search, page = 1, limit = 10, sort = "-createdAt", } = query;
    const filter = {};
    // Filter by status
    if (status)
        filter.status = status;
    // Filter by scheduling
    if (isScheduling !== undefined)
        filter.isScheduling = isScheduling === "true";
    // Search in name, email, phone, subject
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
        contact_model_1.Contact.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        contact_model_1.Contact.countDocuments(filter),
    ]);
    return {
        contacts,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getContactById = async (id) => {
    const result = await contact_model_1.Contact.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Contact not found");
    }
    return result;
};
const updateContact = async (id, payload) => {
    const result = await contact_model_1.Contact.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Contact not found");
    }
    return result;
};
const deleteContact = async (id) => {
    const result = await contact_model_1.Contact.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Contact not found");
    }
    return result;
};
exports.ContactService = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
};
//# sourceMappingURL=contact.service.js.map