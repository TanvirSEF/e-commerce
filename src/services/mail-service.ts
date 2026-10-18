import nodemailer, { type Transporter } from "nodemailer"
import { getSmtpSettings, type SmtpSettings } from "./settings-service"

let cachedTransporter: Transporter | null = null
let cachedSettingsKey: string = ""

/**
 * Reset the active transporter so changes to SMTP credentials take immediate effect
 */
export function clearMailTransporterCache() {
  cachedTransporter = null
  cachedSettingsKey = ""
}

/**
 * Creates or reuses a Nodemailer Transporter instance configured from DB settings
 */
export async function getMailTransporter(settingsOverride?: SmtpSettings): Promise<{
  transporter: Transporter
  settings: SmtpSettings
}> {
  const settings = settingsOverride || (await getSmtpSettings())
  const key = `${settings.mailDriver}_${settings.mailHost}_${settings.mailPort}_${settings.mailUsername}_${settings.mailPassword}_${settings.mailEncryption}`

  if (!settingsOverride && cachedTransporter && cachedSettingsKey === key) {
    return { transporter: cachedTransporter, settings }
  }

  // Determine TLS / SSL security mode
  const isSsl = settings.mailEncryption === "ssl" || Number(settings.mailPort) === 465

  const transportConfig: any = {
    host: settings.mailHost,
    port: Number(settings.mailPort) || 587,
    secure: isSsl,
    connectionTimeout: 12000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    tls: {
      // Allow self-signed or cPanel certificates gracefully
      rejectUnauthorized: false,
    },
  }

  if (settings.mailUsername || settings.mailPassword) {
    transportConfig.auth = {
      user: settings.mailUsername,
      pass: settings.mailPassword || "",
    }
  }

  const transporter = nodemailer.createTransport(transportConfig)

  if (!settingsOverride) {
    cachedTransporter = transporter
    cachedSettingsKey = key
  }

  return { transporter, settings }
}

/**
 * Verify socket connectivity and authentication against the configured SMTP server
 */
export async function verifySmtpConnection(settingsOverride?: SmtpSettings): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    const { transporter, settings } = await getMailTransporter(settingsOverride)

    if (!settings.mailHost || !settings.mailUsername) {
      return {
        success: false,
        message: "SMTP Mail Host and Username are required to establish connection.",
      }
    }

    await transporter.verify()
    return {
      success: true,
      message: `Successfully connected to SMTP server ${settings.mailHost}:${settings.mailPort}`,
    }
  } catch (err: any) {
    let friendlyMessage = err?.message || "Failed to establish SMTP connection"
    
    if (err?.code === "EAUTH" || err?.responseCode === 535) {
      friendlyMessage = "Authentication failed (535): Invalid username or password. If using Gmail, make sure to use a 16-character App Password."
    } else if (err?.code === "ECONNREFUSED") {
      friendlyMessage = `Connection refused at host. Please verify the mail server host and port (${err?.address || "server"}).`
    } else if (err?.code === "ETIMEDOUT") {
      friendlyMessage = "Connection timed out. Check if your mail port (e.g. 587 or 465) is blocked by your hosting or firewall."
    }

    return {
      success: false,
      message: friendlyMessage,
      details: {
        code: err?.code,
        command: err?.command,
        response: err?.response,
      },
    }
  }
}

/**
 * High-fidelity responsive Active eCommerce HTML Email Template
 */
export function renderEmailTemplate(options: {
  title: string
  bodyHtml: string
  cta?: { label: string; url: string }
  storeName?: string
}): string {
  const storeName = options.storeName || "Active eCommerce CMS"
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #292933;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f6f8;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #00002e;
      padding: 24px 32px;
      text-align: center;
      border-bottom: 3px solid #d43533;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header span {
      color: #ffc519;
    }
    .content {
      padding: 32px;
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
    }
    .content h2 {
      margin-top: 0;
      font-size: 18px;
      color: #111827;
      font-weight: 700;
    }
    .cta-container {
      margin: 28px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #d43533;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(212, 53, 51, 0.25);
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #e0f2fe;
      color: #0369a1;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${storeName}</h1>
      </div>
      <div class="content">
        <h2>${options.title}</h2>
        ${options.bodyHtml}
        ${
          options.cta
            ? `
          <div class="cta-container">
            <a href="${options.cta.url}" class="btn" target="_blank">${options.cta.label}</a>
          </div>
        `
            : ""
        }
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0;">This email was automatically generated by ${storeName}.</p>
        <p style="margin: 0;">Please do not reply directly to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Dispatch an email with full error handling and delivery metadata
 */
export async function sendMail(options: {
  to: string
  subject: string
  html?: string
  text?: string
  fromName?: string
  fromAddress?: string
  settingsOverride?: SmtpSettings
}): Promise<{
  success: boolean
  messageId?: string
  message: string
  error?: any
}> {
  try {
    const { transporter, settings } = await getMailTransporter(options.settingsOverride)

    const fromAddress = options.fromAddress || settings.mailFromAddress || settings.mailUsername
    const fromName = options.fromName || settings.mailFromName || "Active eCommerce System"

    if (!fromAddress) {
      return {
        success: false,
        message: "Sender email address is not configured in SMTP settings.",
      }
    }

    const mailOptions = {
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
      message: `Email dispatched successfully (ID: ${info.messageId})`,
    }
  } catch (err: any) {
    console.error("sendMail error:", err?.message || err)
    let msg = err?.message || "Failed to send email"
    
    if (err?.code === "EAUTH" || err?.responseCode === 535) {
      msg = "Authentication failed (535): Invalid username or password."
    } else if (err?.code === "ECONNREFUSED") {
      msg = "Connection refused by SMTP mail server host."
    }

    return {
      success: false,
      message: msg,
      error: err,
    }
  }
}

/**
 * Send a diagnostic test email to verify end-to-end SMTP mail server delivery
 */
export async function sendDiagnosticTestEmail(
  toEmail: string,
  settingsOverride?: SmtpSettings
): Promise<{ success: boolean; message: string; messageId?: string }> {
  const cleanEmail = toEmail.trim()
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, message: "Please provide a valid recipient email address." }
  }

  const { settings } = await getMailTransporter(settingsOverride)
  const timestamp = new Date().toUTCString()

  const bodyHtml = `
    <p>Congratulations! Your SMTP outgoing mail transport has been successfully verified.</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #475569; text-transform: uppercase;">Diagnostic Configuration</h3>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b; width: 140px;">Mail Driver:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${settings.mailDriver.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">SMTP Host:</td>
          <td style="padding: 4px 0; font-family: monospace; font-weight: 600; color: #0f172a;">${settings.mailHost}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">SMTP Port:</td>
          <td style="padding: 4px 0; font-family: monospace; font-weight: 600; color: #0f172a;">${settings.mailPort}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Encryption:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${settings.mailEncryption.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Sender:</td>
          <td style="padding: 4px 0; color: #0f172a;">${settings.mailFromName} &lt;${settings.mailFromAddress || settings.mailUsername}&gt;</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Dispatch Time:</td>
          <td style="padding: 4px 0; color: #0f172a;">${timestamp}</td>
        </tr>
      </table>
    </div>
    <p style="font-size: 13px; color: #64748b;">Your eCommerce system is now fully configured to deliver order invoices, verification OTP codes, customer inquiry notifications, and seller updates.</p>
  `

  const html = renderEmailTemplate({
    title: "SMTP Server Diagnostic Test",
    bodyHtml,
    storeName: settings.mailFromName || "Active eCommerce",
  })

  const text = `SMTP Diagnostic Test\nYour SMTP server (${settings.mailHost}:${settings.mailPort}) is working properly.\nTimestamp: ${timestamp}`

  const result = await sendMail({
    to: cleanEmail,
    subject: `[Diagnostic Test] SMTP Outgoing Mail Verification - ${timestamp}`,
    html,
    text,
    settingsOverride,
  })

  if (result.success) {
    return {
      success: true,
      message: `Diagnostic test email successfully dispatched to ${cleanEmail}!`,
      messageId: result.messageId,
    }
  }

  return {
    success: false,
    message: result.message,
  }
}
