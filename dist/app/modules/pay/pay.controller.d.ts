import { Request, Response } from "express";
export declare const paymentControler: {
    createPaymentIntent: (req: Request, res: Response, next: import("express").NextFunction) => void;
    Webhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllTransactions: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleTenantTransactions: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleTransactionsByStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=pay.controller.d.ts.map