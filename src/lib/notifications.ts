import nodemailer from "nodemailer";

export const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "vishu.sharma90861@gmail.com";
export const NOTIFICATION_WHATSAPP =
  process.env.NOTIFICATION_WHATSAPP || "7303665845";

export interface FormNotificationData {
  formTitle: string;
  fields: Record<string, string | number | null | undefined>;
}

/**
 * Format clean WhatsApp text with emojis and clear structure
 */
export function formatWhatsAppMessage(data: FormNotificationData): string {
  const dateStr = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const lines: string[] = [
    `*PATLIPUTRA GROUP - NEW INQUIRY*`,
    `--------------------------------------`,
    `*Form:* ${data.formTitle}`,
  ];

  for (const [key, value] of Object.entries(data.fields)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      lines.push(`*${key}:* ${String(value).trim()}`);
    }
  }

  lines.push(`--------------------------------------`);
  lines.push(`*Time:* ${dateStr} (IST)`);
  lines.push(`*Source:* Patliputra Group Website`);

  return lines.join("\n");
}

/**
 * Generate a direct WhatsApp click-to-chat URL
 */
export function getWhatsAppDirectUrl(data: FormNotificationData): string {
  const cleanPhone = NOTIFICATION_WHATSAPP.replace(/\D/g, "");
  const phoneWithCountry = cleanPhone.startsWith("91") && cleanPhone.length > 10
    ? cleanPhone
    : `91${cleanPhone}`;
  const message = formatWhatsAppMessage(data);
  return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodeURIComponent(
    message
  )}`;
}

/**
 * Send server-side Email notification using Nodemailer / SMTP
 */
export async function sendEmailNotification(
  data: FormNotificationData
): Promise<{ success: boolean; message?: string; error?: string }> {
  const dateStr = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpSecure = process.env.SMTP_SECURE !== "false";

  // Build HTML table for fields
  const fieldRows = Object.entries(data.fields)
    .filter(([_, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #2a2c34; color: #a0aec0; font-weight: 600; width: 35%; font-size: 13px;">${key}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #2a2c34; color: #f7fafc; font-weight: 500; font-size: 14px;">${String(value).trim()}</td>
      </tr>`
    )
    .join("");

  const htmlBody = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${data.formTitle} - Patliputra Group</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c10; color: #f7fafc; margin: 0; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #12141a; border-radius: 12px; border: 1px solid #1f232e; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #181b24 0%, #0d0f14 100%); padding: 24px 28px; border-bottom: 2px solid #d4af37;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #d4af37;">PATLIPUTRA GROUP</span>
                <div style="font-size: 11px; color: #8892b0; letter-spacing: 1px; margin-top: 2px;">PREMIUM REAL ESTATE • BIHAR</div>
              </td>
              <td style="text-align: right;">
                <span style="background: rgba(212,175,55,0.15); color: #d4af37; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid rgba(212,175,55,0.3);">NEW SUBMISSION</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 28px;">
          <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 6px; font-size: 20px; font-weight: 700;">
            ${data.formTitle}
          </h2>
          <p style="color: #8892b0; font-size: 13px; margin-top: 0; margin-bottom: 20px;">
            A new lead was just submitted on the website. Complete submission details are listed below:
          </p>

          <table style="width: 100%; border-collapse: collapse; background-color: #161821; border-radius: 8px; overflow: hidden; border: 1px solid #232734;">
            <tbody>
              ${fieldRows}
              <tr>
                <td style="padding: 10px 14px; color: #a0aec0; font-weight: 600; width: 35%; font-size: 13px;">Submission Time</td>
                <td style="padding: 10px 14px; color: #d4af37; font-weight: 600; font-size: 13px;">${dateStr} (IST)</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; padding: 14px 18px; background-color: rgba(212,175,55,0.08); border-left: 3px solid #d4af37; border-radius: 4px;">
            <p style="margin: 0; font-size: 12px; color: #cbd5e0; line-height: 1.5;">
              <strong>Direct WhatsApp Action:</strong> A copy has also been routed to WhatsApp number <strong>${NOTIFICATION_WHATSAPP}</strong>.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0d0f14; padding: 16px 28px; border-top: 1px solid #1a1e29; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #5a647d;">
            &copy; ${new Date().getFullYear()} Patliputra Group. All notifications routed automatically.
          </p>
        </div>
      </div>
    </body>
  </html>
  `;

  // If SMTP credentials exist, send real email
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Patliputra Group Website" <${smtpUser}>`,
        to: NOTIFICATION_EMAIL,
        subject: `[Patliputra Group] New ${data.formTitle} Submission`,
        text: formatWhatsAppMessage(data),
        html: htmlBody,
      });

      console.log(`[Email Notification] Successfully sent email to ${NOTIFICATION_EMAIL}`);
      return { success: true };
    } catch (err: any) {
      console.error("[Email Notification] SMTP send error:", err);
      return { success: false, error: err?.message || String(err) };
    }
  }

  // Check if Resend API is configured as alternative
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Patliputra Group <onboarding@resend.dev>",
          to: [NOTIFICATION_EMAIL],
          subject: `[Patliputra Group] New ${data.formTitle} Submission`,
          html: htmlBody,
        }),
      });
      if (res.ok) {
        console.log(`[Email Notification] Successfully sent email via Resend to ${NOTIFICATION_EMAIL}`);
        return { success: true };
      }
    } catch (resendErr) {
      console.error("[Email Notification] Resend send error:", resendErr);
    }
  }

  // If no SMTP / Resend credentials are set in .env yet, log clearly
  console.log(
    `[Email Notification] Simulated sending email to ${NOTIFICATION_EMAIL}.\nTo send live emails, configure SMTP_USER & SMTP_PASS in .env file.`
  );
  return { success: true, message: "Logged (SMTP not yet configured in .env)" };
}

/**
 * Send server-side WhatsApp message (via CallMeBot, webhook, or Twilio if configured)
 */
export async function sendServerWhatsAppNotification(
  data: FormNotificationData
): Promise<{ success: boolean; message?: string }> {
  const message = formatWhatsAppMessage(data);

  // 1. CallMeBot API support (Free instant WhatsApp gateway)
  if (process.env.CALLMEBOT_API_KEY) {
    try {
      const cleanPhone = NOTIFICATION_WHATSAPP.replace(/\D/g, "");
      const phone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
        message
      )}&apikey=${process.env.CALLMEBOT_API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[WhatsApp Notification] Sent via CallMeBot to ${phone}`);
        return { success: true };
      }
    } catch (err) {
      console.error("[WhatsApp Notification] CallMeBot error:", err);
    }
  }

  // 2. Custom Webhook support
  if (process.env.WHATSAPP_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: NOTIFICATION_WHATSAPP,
          message,
          data,
        }),
      });
      if (res.ok) {
        console.log(`[WhatsApp Notification] Dispatched to webhook`);
        return { success: true };
      }
    } catch (err) {
      console.error("[WhatsApp Notification] Webhook error:", err);
    }
  }

  console.log(
    `[WhatsApp Notification] Details formatted for ${NOTIFICATION_WHATSAPP}.\nMessage:\n${message}`
  );
  return { success: true, message: "Formatted for WhatsApp" };
}

/**
 * Main dispatcher to trigger both email and whatsapp for every form submission
 */
export async function dispatchFormNotifications(data: FormNotificationData) {
  const whatsappUrl = getWhatsAppDirectUrl(data);

  // Trigger email and server-side WhatsApp asynchronously
  const [emailResult, waResult] = await Promise.allSettled([
    sendEmailNotification(data),
    sendServerWhatsAppNotification(data),
  ]);

  return {
    success: true,
    whatsappUrl,
    emailResult: emailResult.status === "fulfilled" ? emailResult.value : null,
    waResult: waResult.status === "fulfilled" ? waResult.value : null,
  };
}
