const pool = require("../config/db");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set the API key once

const sendOTPMail = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const templatePath = path.join(__dirname, "..", "emails", "passwordReset.html");
    let html = await fs.readFile(templatePath, "utf8");
    let htmlTemplate = html.replace(/{{OTP}}/g, otp);

    const reset_token = crypto.randomBytes(32).toString("hex");
    const otp_expires_at = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
    const otp_hash = await bcrypt.hash(otp.toString(), 10);

    await pool.query(
      "UPDATE users SET reset_token = $1, otp_hash = $2, otp_expires = $3 WHERE email = $4",
      [reset_token, otp_hash, otp_expires_at, email]
    );

    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER, // Use a verified sender
      subject: "Reset Your Learnify Password",
      html: htmlTemplate,
    };

    await sgMail.send(msg);

    return "OTP Sent Successfully";
  } catch (error) {
    console.error("Email send error:", error.response?.body || error);
    return "Server Error";
  }
};

module.exports = {
  sendOTPMail,
};
