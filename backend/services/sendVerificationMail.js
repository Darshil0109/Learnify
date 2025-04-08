const pool = require("../config/db");
const nodemailer = require("nodemailer")
require('dotenv').config();
const crypto = require('crypto');

const sendVerificationMail = async(email) =>{
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const token_expires_at = new Date(Date.now() + (1000 * 60 * 15)); // 15 minutes in milliseconds
        await pool.query("UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE email = $3", [token, token_expires_at, email]);
        const link = `${process.env.CLIENT_URL}/verify/${token}`        
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
            subject: 'Hello from my app (test email)',
            text: 'Just checking if this works!',
            html: '<p>Just checking if this works! <a href="'+link+'">Continue</a></p>',    
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