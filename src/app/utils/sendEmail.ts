import { Resend } from "resend";
import config from "../config";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

/**
 * Validate config ONCE at module load
 */
if (!config.RESEND_API_KEY) {
  throw new AppError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "RESEND_API_KEY is missing"
  );
}

if (!config.EMAIL_TEMPLATE_ID) {
  throw new AppError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "EMAIL_TEMPLATE_ID is missing"
  );
}

/**
 * Singleton Resend client
 */
const resend = new Resend(config.RESEND_API_KEY);

/**
 * Send verification email using Resend template
 */
export const sendVerificationCodeEmail = async (
  email: string,
  code: string,
  name: string
) => {
  console.info("➡️ sendVerificationCodeEmail called for:", email);

  // TypeScript knows EMAIL_TEMPLATE_ID exists now, use !
  const templateId = config.EMAIL_TEMPLATE_ID!;

  const { data, error } = await resend.emails.send({
    from: "Support <support@parvez.dev>",
    to: email,
    template: {
      id: templateId,
      variables: {
        NAME: name,
        CODE: code,
        YEAR: new Date().getFullYear(),
      },
    },
  });

  if (error) {
    console.error("❌ Resend email error:", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Failed to send verification email"
    );
  }

  console.info("✅ Verification email sent. ID:", data?.id);

  return data; // { id: string }
};
