const pool = require("../config/db");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const fs = require("fs/promises");

// Set up SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationMail = async (email) => {
  try {
    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    const token_expires_at = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // Update token and expiration in the database
    await pool.query(
      "UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE email = $3",
      [token, token_expires_at, email]
    );

    // Generate the verification URL
    const link = `${process.env.CLIENT_URL}/verify/${token}`;

    // Load and update the email template with the verification URL
    const templatePath = path.join(__dirname, "..", "emails", "verificationMail.html");
    let html = await fs.readFile(templatePath, "utf8");
    let htmlTemplate = html.replace(/{{VERIFICATION_URL}}/g, link);

    // Prepare the email content
    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER, // Verified sender in SendGrid
      subject: "Verify Your Learnify Email Address",
      html: htmlTemplate,
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    return "Email Sent Successfully";
  } catch (error) {
    console.error("Error sending verification email:", error.response?.body || error);
    return "Server Error";
  }
};

module.exports = {
  sendVerificationMail,
};
