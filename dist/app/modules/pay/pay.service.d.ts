import { Request } from "express";
import { Types } from "mongoose";
export declare const getSingleTransactionsByStatusFunc: (req: Request) => Promise<any[]>;
export declare const payService: {
    createPaymentIntentFunc: (req: Request) => Promise<{
        clientSecret: string | null;
    }>;
    WebhookFunc: (rawBody: Buffer | string, signatureHeader?: string) => Promise<{
        received: boolean;
    }>;
    getAllTransactionsFunc: (req: Request) => Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./pay.interface").IpayProduct, {}, import("mongoose").DefaultSchemaOptions> & import("./pay.interface").IpayProduct & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    } | undefined>;
    getSingleTenantTransactionsFunc: (req: Request) => Promise<(import("mongoose").Document<unknown, {}, import("./pay.interface").IpayProduct, {}, import("mongoose").DefaultSchemaOptions> & import("./pay.interface").IpayProduct & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getSingleTransactionsByStatusFunc: (req: Request) => Promise<any[]>;
};
//# sourceMappingURL=pay.service.d.ts.map