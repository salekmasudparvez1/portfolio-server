import { Request } from "express"
import Stripe from "stripe";
import config from "../../config";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { getStripe, totatlAmountCalculate } from "./pay.utils";
import { TenantApplicationModel } from "../tenent/tenent.model";
import { Types } from "mongoose";
import { RentalHouseModel } from "../landloard/landloard.model";
import { ITenantApplicationPopulate } from "../tenent/tenent.interface"
import { PayModel } from "./pay.model";


const createPaymentIntentFunc = async (req: Request) => {
  const id = new Types.ObjectId(req.body.id);
  const stripe = getStripe();

  // STEP 1 Fetch application (READ ONLY)
  const application = await TenantApplicationModel.findById(id)
    .populate({ path: "rentalHouseId", model: RentalHouseModel }) as ITenantApplicationPopulate | null;

  if (!application || !application.rentalHouseId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid application");
  }

  // STEP 2  BLOCK: already paid users
  if (application.paymentStatus === "PAID") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment already completed for this application");
  }

  // STEP 33 Reuse existing PaymentIntent (refresh / back in website)
  if (application.paymentIntentId && application.paymentStatus === "PENDING") {
    const existingIntent = await stripe.paymentIntents.retrieve(
      application.paymentIntentId
    );

    const reusableStatuses = [
      "requires_payment_method",
      "requires_confirmation",
      "requires_action",
      "processing",
    ];
    if (existingIntent.status === "succeeded") {
      throw new AppError(StatusCodes.BAD_REQUEST, "Payment already completed for this application");
    }

    if (reusableStatuses.includes(existingIntent.status)) {
      console.log('click-inside');
      return {
        clientSecret: existingIntent.client_secret,
      };
    }
  }

  // STEP 4 Create NEW PaymentIntent (first time or failed/canceled)
  const amount = totatlAmountCalculate(
    application.date,
    application.rentalHouseId.rentAmount
  );

  const intent = await stripe.paymentIntents.create(
    {
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        requestId: id.toString() || application._id?.toString() || '',
      },
    },
    {
      // EXTRA SAFETY (prevents double creation)
      idempotencyKey: `tenant-app-${id.toString()}`,
    }
  );

  // STEP 5 Save intent info in DB
  await TenantApplicationModel.findByIdAndUpdate(id, {
    paymentIntentId: intent.id,
    paymentStatus: "PENDING",
  });

  return {
    clientSecret: intent.client_secret,
  };
};

const WebhookFunc = async (rawBody: Buffer | string, signatureHeader?: string) => {
  /* --------------- doc:https://docs.stripe.com/webhooks/signature--------------*/
  /* 
  1. first step:initialze stripe (useing secret key)==> const stripe = getStripe();
  2. second step: convert rawBody to Buffer if it is string==> const payload = rawBody instanceof Buffer ? rawBody : Buffer.from(rawBody);
  3. third step: call stripe.webhooks.constructEvent with four parameter (payload,signatureHeader,endpointSecret) 
    doc:https://docs.stripe.com/webhooks/quickstart?lang=node 
    => when processing webhook events, stripe recommend securing endpoint by verifying that the event is coming from Stripe. To do this, use the Stripe-Signature header and call the constructEvent() function with three parameters:

    requestBody: The request body string sent by Stripe.
    signature: The Stripe-Signature header in the request sent by Stripe[--req.headers['stripe-signature']--].
    endpointSecret: The secret associated with my endpoint [ webhook endpoint secret].
  */
  /*--------------------------happy codding with Parvez---------------------------------- */
  const endpointSecret = config.STRIPE_WEBHOOK_SECRET as string;
  if (!endpointSecret) {
    console.error("❌ Stripe webhook secret not configured");
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Stripe webhook secret is not configured');
  }

  let event: Stripe.Event;
  const stripe = getStripe();
  try {
    const payload = rawBody instanceof Buffer ? rawBody : Buffer.from(rawBody);
    event = stripe.webhooks.constructEvent(payload, signatureHeader || "", endpointSecret);
    console.log("✅ Stripe webhook event constructed:", event.type);
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err);
    throw new AppError(StatusCodes.BAD_REQUEST, "Stripe webhook signature verification failed");
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("💰 paymentIntent received:", paymentIntent);

        const requestId = paymentIntent.metadata?.requestId;
        if (!requestId) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Missing requestId in paymentIntent requestId metadata");

        }

        // Check if transaction already exists
        const alreadyExists = await PayModel.findOne({ transactionId: paymentIntent.id });
        console.log("🔍 Transaction exists check:", alreadyExists);
        if (alreadyExists) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Transaction already recorded");

        }

        // Determine payment method
        let paymentMethod = "unknown";
        let charge: Stripe.Charge | undefined;
        if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== "string") {
          charge = paymentIntent.latest_charge as Stripe.Charge;
        } else if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === "string") {
          try {
            charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
          } catch (err) {
            console.error("❌ Failed to retrieve charge:", err);
          }
        }
        paymentMethod = charge?.payment_method_details?.type || "unknown";


        await PayModel.create({
          transactionId: paymentIntent.id,
          amountCents: Number(paymentIntent.amount),
          amount: Number(paymentIntent.amount_received) / 100,
          currency: paymentIntent.currency,
          paymentMethod,
          paymentStatus: { status: "success", message: "Payment succeeded" },
          requestId: new Types.ObjectId(requestId),
        });

        await TenantApplicationModel.findByIdAndUpdate(requestId, { paymentStatus: "PAID" });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const requestId = paymentIntent.metadata?.requestId;

        if (!requestId) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Missing requestId in paymentIntent metadata");

        }

        const exists = await PayModel.findOne({ transactionId: paymentIntent.id });
        console.log("🔍 Transaction exists check (failed):", exists);
        if (exists) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Transaction already recorded");
        }

        const errorMsg = paymentIntent.last_payment_error?.message || "Payment failed";

        await PayModel.create({
          transactionId: paymentIntent.id,
          amountCents: Number(paymentIntent.amount),
          amount: 0,
          currency: paymentIntent.currency,
          paymentMethod: "unknown",
          paymentStatus: { status: "failed", message: errorMsg },
          requestId: new Types.ObjectId(requestId),
        });



        await TenantApplicationModel.findByIdAndUpdate(requestId, { paymentStatus: "FAILED" });
        console.log("✅ TenantApplicationModel updated to FAILED");

        break;
      }

      default:
        console.log(`ℹ️ Unhandled Stripe event: ${event.type}`);
    }
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error processing Stripe webhook event');
  }

  return { received: true };
};

const getAllTransactionsFunc = async (req: Request) => {
  const rawUser = (req as any).user;
  if (!rawUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  /* part 1 for tanent */
  if (rawUser?.role === "tenant") {
    const total = await PayModel.countDocuments().populate({
      path: "requestId",
      populate: [
        {
          path: "tenantId",
          model: "user",
          match: { _id: new Types.ObjectId(rawUser?.id) }
        },
        {
          path: "landloardId",
          model: "user"
        }
      ],

    });

    const transactions = await PayModel.find().populate({
      path: "requestId",
      populate: [
        {
          path: "tenantId",
          model: "user",
          match: { _id: new Types.ObjectId(rawUser?.id) }
        },
        {
          path: "landloardId",
          model: "user"
        },
        {
          path: "rentalHouseId",
          model: RentalHouseModel,
        }
      ],

    }).skip(skip).limit(limit);
    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
      }
    };
  } else if (rawUser?.role === "landlord") {
    /* part 2 for landlord */
    const total = await PayModel.countDocuments().populate({
      path: "requestId",
      populate: [
        {
          path: "tenantId",
          model: "user",

        },
        {
          path: "landloardId",
          model: "user",
          match: { _id: new Types.ObjectId(rawUser?.id) }
        }
      ],

    });
    const transactions = await PayModel.find().populate({
      path: "requestId",
      populate: [
        {
          path: "tenantId",
          model: "user",

        },
        {
          path: "landloardId",
          model: "user",
          match: { _id: new Types.ObjectId(rawUser?.id) }
        },
        {
          path: "rentalHouseId",
          model: RentalHouseModel,
        }

      ],

    }).skip(skip).limit(limit);
    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
      }
    };
  } else if (rawUser?.role === "admin") {
    /* part 3 for admin */
    const total = await PayModel.countDocuments();
    const transactions = await PayModel.find().populate({
      path: "requestId",
      populate: [
        {
          path: "tenantId",
          model: "user",

        },
        {
          path: "landloardId",
          model: "user",
        },
        {
          path: "rentalHouseId",
          model: RentalHouseModel,
        }
      ],

    }).skip(skip).limit(limit);
    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
      }
    };
  }

}
const getSingleTenantTransactionsFunc = async (req: Request) => {
  const id = req.params.id;
  const rawUser = (req as any).user;
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Tenant id is required');
  }

  // Validate ObjectId to avoid BSONError
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid tenant id');
  }

  console.log("🚀 ~ file: pay.service.ts:326 ~ getSingleTenantTransactionsFunc ~ rawUser:", rawUser, id);
  // use findById since `id` is validated
  const transactions = await PayModel.findById(id).populate({
    path: "requestId",
    populate: [
      {
        path: "tenantId",
        model: "user",
        match: { _id: new Types.ObjectId(rawUser?.id) }

      },
      {
        path: "landloardId",
        model: "user"
      },
      {
        path: "rentalHouseId",
        model: RentalHouseModel,
      }
    ],

  });
  return transactions;
}


export const getSingleTransactionsByStatusFunc = async (req: Request) => {
  const rawUser = (req as any).user;

  // Check if rawUser.id is a valid ObjectId

  if (!rawUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }
  const transactions = await PayModel.aggregate([
    // 1. Only successful payments
    { $match: { "paymentStatus.status": "success" } },

    // 2. Join tenantRequests
    {
      $lookup: {
        from: "tenantRequests",
        let: { reqId: { $toObjectId: "$requestId" } }, // remove $toObjectId if already ObjectId
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$reqId"] } } }
        ],
        as: "request"
      }
    },
    { $unwind: { path: "$request", preserveNullAndEmptyArrays: true } },

    // 3. Match only future requests
    {
      $match: {
        "request.date.to": { $gte: new Date() }
      }
    },

    // 4. Join rentalHouses
    {
      $lookup: {
        from: "rentalHouses",
        localField: "request.rentalHouseId",
        foreignField: "_id",
        as: "rentalHouse"
      }
    },
    { $unwind: { path: "$rentalHouse", preserveNullAndEmptyArrays: true } },

    // 5. Project fields
    {
      $project: {
        _id: 0,
        title: "$rentalHouse.title",
        date: "$request.date",
        location: "$request.location",
        amount: "$amount",
        rentAmount: "$request.rentAmount"
      }
    }
  ]);





  return transactions;
};


export const payService = {
  createPaymentIntentFunc,
  WebhookFunc,
  getAllTransactionsFunc,
  getSingleTenantTransactionsFunc,
  getSingleTransactionsByStatusFunc

}
