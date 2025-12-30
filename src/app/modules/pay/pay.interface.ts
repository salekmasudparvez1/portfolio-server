import { Types } from "mongoose";
import { ITenantApplication } from "../tenent/tenent.interface";
import { IUserCreate } from "../auth/auth.interface";
import { IRentalHouse } from "../landloard/landloard.interface";



export interface IpayProduct {
    transactionId?: string;
    currency?: string;
    amountCents?: number;
    amount?: number;
    paymentMethod?: string;
    paymentStatus: { status: "failed" | "success"; message?: string };
    requestId?: Types.ObjectId;
   

}

export interface IPayProductPolute extends Omit<IpayProduct, "requestId" | "landloardId" | "rentalHouseId" | "tenantId"> {
    requestId: ITenantApplication;
}