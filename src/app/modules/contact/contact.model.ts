import { Schema, model } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isScheduling: {
      type: Boolean,
      required: true,
      default: false,
    },
    meetingDate: {
      type: String,
      required: function(this: IContact) {
        return this.isScheduling;
      },
    },
    meetingTime: {
      type: String,
      required: function(this: IContact) {
        return this.isScheduling;
      },
    },
    status: {
      type: String,
      enum: ["pending", "responded", "scheduled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = model<IContact>("Contact", contactSchema);
