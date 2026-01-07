import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const createContact = async (payload: IContact) => {
  const result = await Contact.create(payload);
  return result;
};

const getAllContacts = async (query: Record<string, any>) => {
  const {
    status,
    isScheduling,
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const filter: Record<string, any> = {};

  // Filter by status
  if (status) filter.status = status;

  // Filter by scheduling
  if (isScheduling !== undefined) filter.isScheduling = isScheduling === "true";

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
    Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Contact.countDocuments(filter),
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

const getContactById = async (id: string) => {
  const result = await Contact.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }
  return result;
};

const updateContact = async (id: string, payload: Partial<IContact>) => {
  const result = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

const deleteContact = async (id: string) => {
  const result = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
