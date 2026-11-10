
require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

async function userRegistrationEmail(to, name) {
  const subject = "Welcome to Backend Ledger";

  const text = `Hello ${name},

Thank you for registering to Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

  const html = `
    <h2>Welcome to Backend Ledger!</h2>
    <p>Hello ${name},</p>
    <p>Thank you for registering. We're excited to have you on board!</p>
    <p>Best regards,<br>The Backend Ledger Team</p>
  `;

  return sendEmail(to, subject, text, html);
}

module.exports = {
  userRegistrationEmail,
  transporter,
  sendEmail,
};
