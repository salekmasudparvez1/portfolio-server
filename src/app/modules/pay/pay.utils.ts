
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import AppError from "../../errors/AppError";
import Stripe from "stripe";

export const getStripe = () => {
  let stripeInstance: Stripe | null = null;

  if (!stripeInstance) {

    if (!config.STRIPE_SECRET_KEY) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Stripe secret-key is not configured');
    }

    stripeInstance = new Stripe(config.STRIPE_SECRET_KEY as string);
  }
  return stripeInstance;
};
export const totatlAmountCalculate = (date : {from: Date, to: Date}, rentAmount: number) => {
  const rentAmountPerMonth = Number(rentAmount);
  const startingDate = new Date(date?.from);
  const endingDate = new Date(date?.to);

  const timeDifference = endingDate.getTime() - startingDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  const totalRent = (daysDifference / 30) * rentAmountPerMonth;
  return totalRent;
}
