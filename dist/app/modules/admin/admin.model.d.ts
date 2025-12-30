import mongoose, { Types } from 'mongoose';
import { IAdmin } from './admin.interface';
export declare const AdminModel: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, mongoose.DefaultSchemaOptions> & IAdmin & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IAdmin>;
//# sourceMappingURL=admin.model.d.ts.map