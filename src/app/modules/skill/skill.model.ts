import { Schema, model } from "mongoose";
import { ISkill, ISkillItem } from "./skill.interface";

const skillItemSchema = new Schema<ISkillItem>(
  {
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
  },
  { _id: false }
);

const skillSchema = new Schema<ISkill>(
  {
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
        validator: function (skills: ISkillItem[]) {
          return skills.length > 0;
        },
        message: "Skills array must contain at least one skill",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Skill = model<ISkill>("Skill", skillSchema);
