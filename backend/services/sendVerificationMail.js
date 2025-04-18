const pool = require("../config/db");
const nodemailer = require("nodemailer")
require('dotenv').config();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');
const sendVerificationMail = async(email) =>{
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const token_expires_at = new Date(Date.now() + (1000 * 60 * 15)); // 15 minutes in milliseconds
        await pool.query("UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE email = $3", [token, token_expires_at, email]);
        const link = `${process.env.CLIENT_URL}/verify/${token}`        
        const templatePath = path.join(__dirname,"..","emails", 'verificationMail.html');
        let html = await fs.readFile(templatePath, 'utf8');
        let htmlTemplate = html.replace(/{{VERIFICATION_URL}}/g, link);
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
            subject: 'Verify Your Learnify Email Address',
            html: htmlTemplate,    
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error:', error);
              return 'Error in sending email'
            }
            return 'Email Sent Successfully'
        });
    } catch (error) {
        console.log(error);
        return 'Server Error'
    }
}

module.exports = {
    sendVerificationMail
}