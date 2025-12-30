import mongoose from "mongoose";
import { IpayProduct } from "./pay.interface";
export declare const PayModel: mongoose.Model<IpayProduct, {}, {}, {}, mongoose.Document<unknown, {}, IpayProduct, {}, mongoose.DefaultSchemaOptions> & IpayProduct & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, IpayProduct>;
//# sourceMappingURL=pay.model.d.ts.map