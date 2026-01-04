"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = require("mongoose");
const skillItemSchema = new mongoose_1.Schema({
    skill: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const skillSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["backend", "frontend"],
        required: true,
    },
    skills: {
        type: [skillItemSchema],
        required: true,
        validate: {
            validator: function (skills) {
                return skills.length > 0;
            },
            message: "Skills array must contain at least one skill",
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Skill = (0, mongoose_1.model)("Skill", skillSchema);
//# sourceMappingURL=skill.model.js.map