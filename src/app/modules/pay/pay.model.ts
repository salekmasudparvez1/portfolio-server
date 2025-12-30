import mongoose, { Schema } from "mongoose";
import config from "../../config";
import { IpayProduct } from "./pay.interface";
import { TenantApplicationModel } from "../tenent/tenent.model";


const findBasaDB = mongoose.connection.useDb(config.database_name as string);

const paySchema = new Schema(
    {
        transactionId: { type: String },
        amount: { type: Number },
        amountCents: { type: Number },
        paymentMethod: { type: String },
        requestId: { type: Schema.Types.ObjectId, ref: TenantApplicationModel },
        currency: { type: String, required: true },
        paymentStatus: {
            status: { type: String, enum: ['failed', 'success'], required: true },
            message: { type: String }
        }
    },
    { timestamps: true, versionKey: false ,collection: 'transaction' }
)

export const PayModel = findBasaDB.model<IpayProduct>('transaction', paySchema);

