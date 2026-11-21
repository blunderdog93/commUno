import { Resend } from "resend";
import { configDotenv } from "dotenv";

configDotenv();
const resend = new Resend(process.env.RESEND_API_KEY);
async function sendVerificationEmail(email, verificationURL) {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      html: `<p>verify your account <a href ="${verificationURL}">Verify</a>!</p>`,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
}

export default sendVerificationEmail;
