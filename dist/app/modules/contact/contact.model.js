"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
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
        required: function () {
            return this.isScheduling;
        },
    },
    meetingTime: {
        type: String,
        required: function () {
            return this.isScheduling;
        },
    },
    status: {
        type: String,
        enum: ["pending", "responded", "scheduled", "completed"],
        default: "pending",
    },
}, {
    timestamps: true,
});
exports.Contact = (0, mongoose_1.model)("Contact", contactSchema);
//# sourceMappingURL=contact.model.js.map