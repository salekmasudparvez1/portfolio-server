"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payService = exports.getSingleTransactionsByStatusFunc = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const pay_utils_1 = require("./pay.utils");
const tenent_model_1 = require("../tenent/tenent.model");
const mongoose_1 = require("mongoose");
const landloard_model_1 = require("../landloard/landloard.model");
const pay_model_1 = require("./pay.model");
const createPaymentIntentFunc = async (req) => {
    const id = new mongoose_1.Types.ObjectId(req.body.id);
    const stripe = (0, pay_utils_1.getStripe)();
    // STEP 1 Fetch application (READ ONLY)
    const application = await tenent_model_1.TenantApplicationModel.findById(id)
        .populate({ path: "rentalHouseId", model: landloard_model_1.RentalHouseModel });
    if (!application || !application.rentalHouseId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid application");
    }
    // STEP 2  BLOCK: already paid users
    if (application.paymentStatus === "PAID") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment already completed for this application");
    }
    // STEP 33 Reuse existing PaymentIntent (refresh / back in website)
    if (application.paymentIntentId && application.paymentStatus === "PENDING") {
        const existingIntent = await stripe.paymentIntents.retrieve(application.paymentIntentId);
        const reusableStatuses = [
            "requires_payment_method",
            "requires_confirmation",
            "requires_action",
            "processing",
        ];
        if (existingIntent.status === "succeeded") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment already completed for this application");
        }
        if (reusableStatuses.includes(existingIntent.status)) {
           
            return {
                clientSecret: existingIntent.client_secret,
            };
        }
    }
    // STEP 4 Create NEW PaymentIntent (first time or failed/canceled)
    const amount = (0, pay_utils_1.totatlAmountCalculate)(application.date, application.rentalHouseId.rentAmount);
    const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
            requestId: id.toString() || application._id?.toString() || '',
        },
    }, {
        // EXTRA SAFETY (prevents double creation)
        idempotencyKey: `tenant-app-${id.toString()}`,
    });
    // STEP 5 Save intent info in DB
    await tenent_model_1.TenantApplicationModel.findByIdAndUpdate(id, {
        paymentIntentId: intent.id,
        paymentStatus: "PENDING",
    });
    return {
        clientSecret: intent.client_secret,
    };
};
const WebhookFunc = async (rawBody, signatureHeader) => {
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
    const endpointSecret = config_1.default.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
        console.error("❌ Stripe webhook secret not configured");
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Stripe webhook secret is not configured');
    }
    let event;
    const stripe = (0, pay_utils_1.getStripe)();
    try {
        const payload = rawBody instanceof Buffer ? rawBody : Buffer.from(rawBody);
        event = stripe.webhooks.constructEvent(payload, signatureHeader || "", endpointSecret);
      
    }
    catch (err) {
        console.error("❌ Stripe webhook signature verification failed:", err);
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Stripe webhook signature verification failed");
    }
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const requestId = paymentIntent.metadata?.requestId;
                if (!requestId) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Missing requestId in paymentIntent requestId metadata");
                }
                // Check if transaction already exists
                const alreadyExists = await pay_model_1.PayModel.findOne({ transactionId: paymentIntent.id });
              
                if (alreadyExists) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Transaction already recorded");
                }
                // Determine payment method
                let paymentMethod = "unknown";
                let charge;
                if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== "string") {
                    charge = paymentIntent.latest_charge;
                }
                else if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === "string") {
                    try {
                        charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
                    }
                    catch (err) {
                        console.error("❌ Failed to retrieve charge:", err);
                    }
                }
                paymentMethod = charge?.payment_method_details?.type || "unknown";
                await pay_model_1.PayModel.create({
                    transactionId: paymentIntent.id,
                    amountCents: Number(paymentIntent.amount),
                    amount: Number(paymentIntent.amount_received) / 100,
                    currency: paymentIntent.currency,
                    paymentMethod,
                    paymentStatus: { status: "success", message: "Payment succeeded" },
                    requestId: new mongoose_1.Types.ObjectId(requestId),
                });
                await tenent_model_1.TenantApplicationModel.findByIdAndUpdate(requestId, { paymentStatus: "PAID" });
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const requestId = paymentIntent.metadata?.requestId;
                if (!requestId) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Missing requestId in paymentIntent metadata");
                }
                const exists = await pay_model_1.PayModel.findOne({ transactionId: paymentIntent.id });
            
                if (exists) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Transaction already recorded");
                }
                const errorMsg = paymentIntent.last_payment_error?.message || "Payment failed";
                await pay_model_1.PayModel.create({
                    transactionId: paymentIntent.id,
                    amountCents: Number(paymentIntent.amount),
                    amount: 0,
                    currency: paymentIntent.currency,
                    paymentMethod: "unknown",
                    paymentStatus: { status: "failed", message: errorMsg },
                    requestId: new mongoose_1.Types.ObjectId(requestId),
                });
                await tenent_model_1.TenantApplicationModel.findByIdAndUpdate(requestId, { paymentStatus: "FAILED" });
             
                break;
            }
            default:
                console.log(`ℹ️ Unhandled Stripe event: ${event.type}`);
        }
    }
    catch (err) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Error processing Stripe webhook event');
    }
    return { received: true };
};
const getAllTransactionsFunc = async (req) => {
    const rawUser = req.user;
    if (!rawUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    /* part 1 for tanent */
    if (rawUser?.role === "tenant") {
        const total = await pay_model_1.PayModel.countDocuments().populate({
            path: "requestId",
            populate: [
                {
                    path: "tenantId",
                    model: "user",
                    match: { _id: new mongoose_1.Types.ObjectId(rawUser?.id) }
                },
                {
                    path: "landloardId",
                    model: "user"
                }
            ],
        });
        const transactions = await pay_model_1.PayModel.find().populate({
            path: "requestId",
            populate: [
                {
                    path: "tenantId",
                    model: "user",
                    match: { _id: new mongoose_1.Types.ObjectId(rawUser?.id) }
                },
                {
                    path: "landloardId",
                    model: "user"
                },
                {
                    path: "rentalHouseId",
                    model: landloard_model_1.RentalHouseModel,
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
    else if (rawUser?.role === "landlord") {
        /* part 2 for landlord */
        const total = await pay_model_1.PayModel.countDocuments().populate({
            path: "requestId",
            populate: [
                {
                    path: "tenantId",
                    model: "user",
                },
                {
                    path: "landloardId",
                    model: "user",
                    match: { _id: new mongoose_1.Types.ObjectId(rawUser?.id) }
                }
            ],
        });
        const transactions = await pay_model_1.PayModel.find().populate({
            path: "requestId",
            populate: [
                {
                    path: "tenantId",
                    model: "user",
                },
                {
                    path: "landloardId",
                    model: "user",
                    match: { _id: new mongoose_1.Types.ObjectId(rawUser?.id) }
                },
                {
                    path: "rentalHouseId",
                    model: landloard_model_1.RentalHouseModel,
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
    else if (rawUser?.role === "admin") {
        /* part 3 for admin */
        const total = await pay_model_1.PayModel.countDocuments();
        const transactions = await pay_model_1.PayModel.find().populate({
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
                    model: landloard_model_1.RentalHouseModel,
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
};
const getSingleTenantTransactionsFunc = async (req) => {
    const id = req.params.id;
    const rawUser = req.user;
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Tenant id is required');
    }
    // Validate ObjectId to avoid BSONError
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid tenant id');
    }
    // use findById since `id` is validated
    const transactions = await pay_model_1.PayModel.findById(id).populate({
        path: "requestId",
        populate: [
            {
                path: "tenantId",
                model: "user",
                match: { _id: new mongoose_1.Types.ObjectId(rawUser?.id) }
            },
            {
                path: "landloardId",
                model: "user"
            },
            {
                path: "rentalHouseId",
                model: landloard_model_1.RentalHouseModel,
            }
        ],
    });
    return transactions;
};
const getSingleTransactionsByStatusFunc = async (req) => {
    const rawUser = req.user;
    // Check if rawUser.id is a valid ObjectId
    if (!rawUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    const transactions = await pay_model_1.PayModel.aggregate([
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
exports.getSingleTransactionsByStatusFunc = getSingleTransactionsByStatusFunc;
exports.payService = {
    createPaymentIntentFunc,
    WebhookFunc,
    getAllTransactionsFunc,
    getSingleTenantTransactionsFunc,
    getSingleTransactionsByStatusFunc: exports.getSingleTransactionsByStatusFunc
};
//# sourceMappingURL=pay.service.js.map