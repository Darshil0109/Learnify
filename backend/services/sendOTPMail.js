const pool = require("../config/db");
const nodemailer = require("nodemailer")
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');
const path = require('path');
const sendOTPMail = async(email) =>{
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const templatePath = path.join(__dirname,"..","emails", 'passwordReset.html');
        let html = await fs.readFile(templatePath, 'utf8');
        let htmlTemplate = html.replace(/{{OTP}}/g, otp);
        const reset_token = crypto.randomBytes(32).toString('hex');
        const otp_expires_at = new Date(Date.now() + (1000 * 60 * 10)); // 10 minutes in milliseconds
        const otp_hash = await bcrypt.hash(otp.toString(), 10);
        await pool.query("UPDATE users SET reset_token = $1, otp_hash = $2 , otp_expires = $3 WHERE email = $4", [reset_token, otp_hash , otp_expires_at, email]);        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for port 465, false for 587
            auth:{
                user:process.env.GOOGLE_MAIL_APP_EMAIL,
                pass:process.env.GOOGLE_MAIL_APP_PASSWORD,
            }
        });


        const mailOptions = {
            from: 'learnify.27032025@gmail.com',
            to: email,
            subject: 'Reset Your Learnify Password',
            html: htmlTemplate,    
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error:', error);
              return 'Error in sending OTP'
            }
            return 'OTP Sent Successfully'
        });
    } catch (error) {
        console.log(error);
        return 'Server Error'
    }
}

module.exports = {
    sendOTPMail
}