import mongoose, { Schema, Types } from 'mongoose';
import config from '../../config';
import { IAdmin } from './admin.interface';




const AdminSchema = new Schema<IAdmin>(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, ref: "user" },
    permissions: { type: [String], default: [] },
    isSuper: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'admins',
  },
);

export const AdminModel = mongoose.model<IAdmin>('admins', AdminSchema);
