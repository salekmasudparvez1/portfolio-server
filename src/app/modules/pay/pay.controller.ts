import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { payService } from "./pay.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {

  const result = await payService.createPaymentIntentFunc(req as Request);

  sendResponse(res, {
    success: true,
    message: 'Your paymentintent has been success',
    data: result,
    statusCode: StatusCodes.OK,
  });

})

// Stripe webhook handler
const Webhook = catchAsync(async (req: Request, res: Response) => {
  /*--------------------------notes for me----------------------------------- */
  /* safe way to get rawBody if it exists, otherwise use the normal parsed body
  Some middlewares (like express.json()) parse req.body into an object, destroying the raw bytes.for this reason taking req.rowBody if it null or undefined takeing req.body.

  now question is what is destroying bites :❌ Problem: Stripe’s webhook signature verification requires the exact original bytes. If you use req.body after parsing, it may fail verification because some characters, whitespace, or encoding may have changed.

  and there is a "signature" in header from stripe webhook calls :https://docs.stripe.com/webhooks/signature

  */
  /*--------------------------happy codding with Parvez---------------------------------- */

  const rawBodyBuffer = (req as any).rawBody as Buffer | undefined;
  const payloadBody = rawBodyBuffer ?? (req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body)));
  const signature = req.headers['stripe-signature'] as string | undefined;

  const result = await payService.WebhookFunc(payloadBody, signature);

  sendResponse(res, {
    success: true,
    message: 'Your payment has been success',
    data: result,
    statusCode: StatusCodes.OK,
  });
});

// Get all transactions
const getAllTransactions = catchAsync(async (req: Request, res: Response) => {

  const result = await payService.getAllTransactionsFunc(req as Request);

  sendResponse(res, {
    success: true,
    message: 'All transactions fetched successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });

})
// get single tanent transactions by status
const getSingleTransactionsByStatus = catchAsync(async (req: Request, res: Response) => {

  const result = await payService.getSingleTransactionsByStatusFunc(req as Request);

  sendResponse(res, {
    success: true,
    message: 'Single tenant transactions fetched successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });

})
// get single tanent transactions by id
const getSingleTenantTransactions = catchAsync(async (req: Request, res: Response) => {

  const result = await payService.getSingleTransactionsByStatusFunc(req as Request);

  sendResponse(res, {
    success: true,
    message: 'Single tenant transactions fetched successfully',
    data: result,
    statusCode: StatusCodes.OK,
  });

})

export const paymentControler = {
  createPaymentIntent,
  Webhook,
  getAllTransactions,
  getSingleTenantTransactions,
  getSingleTransactionsByStatus
}