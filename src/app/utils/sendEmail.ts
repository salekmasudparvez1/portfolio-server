import { Resend } from "resend";
import config from "../config";

export const sendVerificationCodeEmail = async (email: string, code: string) => {
  console.info("➡️ sendVerificationCodeEmail called for:", email);
  if (!config.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not configured");
    throw new Error("Resend API key not configured");
  }
  const resend = new Resend(config.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: email,
      subject: "Your Email Verification Code",
      html: `
        <h3>Email Verification</h3>
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code will expire in 10 minutes.</p>
      `
    });
    console.info("✅ Resend response:", result);
    // If Resend doesn't return a message id, warn so delivery isn't assumed
    if (!result || !(result as any).id) {
      console.warn("⚠️ Resend did not return a message id; delivery not guaranteed", result);
    }
    return result;
  } catch (err) {
    console.error("❌ Failed to send verification email:", err);
    throw err;
  }
};
