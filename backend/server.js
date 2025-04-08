const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const pool = require("./config/db");
const passport = require('./config/passport');
const cookieParser = require("cookie-parser");
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send("Welcome to the API of Learnify!")
});

app.get('/verify/:token', async (req, res) => {
    const token = req.params.token;
    const isProduction = process.env.NODE_ENV === "PRODUCTION";
    try {
      const result = await pool.query(
        `UPDATE users 
         SET is_verified = true, 
             verification_token = NULL, 
             verification_token_expires = NULL 
         WHERE verification_token = $1 
         RETURNING *`, // ✅ Get updated user
        [token]
      );
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      const user = result.rows[0];
      
      const accessToken = jwt.sign({ user_id: user.user_id , email : user.email , name : user.name , profile_image : user.profile_image , role : user.role , is_verified : user.is_verified , created_at : user.created_at  }, process.env.JWT_SECRET_ACCESS_TOKEN, {
              expiresIn: "15m"
            });
      
      const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET_REFRESH_TOKEN, {expiresIn: "7d"});
      
      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
      })

      res.status(200).json({
        message: "Email verified successfully",
      });
  
    } catch (err) {
      console.error("Verification error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
app.use('/api/auth',authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});