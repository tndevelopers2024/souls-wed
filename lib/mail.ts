import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

/**
 * Sends a notification email upon successful login.
 */
export async function sendLoginNotificationEmail(
  to: string,
  name: string,
  role: string,
  userAgent?: string
) {
  // If SMTP environment variables are not configured, skip sending and log a warning.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials are not fully configured. Skipping login notification email to:", to);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "SoulsWed Security"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: "New Login Detected - SoulsWed",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DEE2E6; border-radius: 8px;">
          <h2 style="color: #EE7429; margin-top: 0;">New Login Alert</h2>
          <p style="color: #1A1A1A; font-size: 16px;">Hello ${name},</p>
          <p style="color: #4a4a4a; line-height: 1.5;">We noticed a new login to your <strong>${role}</strong> account at SoulsWed.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #FCCB11;">
            <p style="margin: 5px 0; color: #1A1A1A;"><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
            ${userAgent ? `<p style="margin: 5px 0; color: #1A1A1A;"><strong>Device/Browser:</strong> ${userAgent}</p>` : ""}
          </div>
          
          <p style="color: #4a4a4a; line-height: 1.5;">If this was you, you can safely ignore this email.</p>
          <p style="color: #4a4a4a; line-height: 1.5;">If you did not authorize this login, please secure your account immediately by resetting your password.</p>
          <br>
          <p style="color: #4a4a4a; line-height: 1.5;">Best regards,<br><strong style="color: #1A1A1A;">SoulsWed Security Team</strong></p>
        </div>
      `,
    });
    console.log("Login notification email sent to %s, messageId: %s", to, info.messageId);
  } catch (error) {
    console.error("Error sending login notification email:", error);
  }
}
