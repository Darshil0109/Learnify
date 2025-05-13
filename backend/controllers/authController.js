const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const pool = require("../config/db")
const { sendVerificationMail } = require("../services/sendVerificationMail");
const { sendOTPMail } = require("../services/sendOTPMail");


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      
      // 1. Query user by email
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      

      if (result.rows.length === 0) {
        return res.status(404).send("User not found");
      }
  
      const user = result.rows[0];
      if(user.auth_provider === 'google'){
        return res.status(403).send("User not registered with this method");
      }
      
      if (!user.is_verified) {
        sendVerificationMail(user.email);
        return res.status(403).send("User not Verified. Verify Email id First by clicking the verification link sent to your email");
      }


      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      
      if (!isMatch) {
        return res.status(401).send("Incorrect password");
      }
  
     
  
      // 3. Create token
      const accessToken = jwt.sign({ user_id: user.user_id , email : user.email , name : user.name , profile_image : user.profile_image , role : user.role , is_verified : user.is_verified , created_at : user.created_at  }, process.env.JWT_SECRET_ACCESS_TOKEN, {
        expiresIn: "15m"
      });

      const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET_REFRESH_TOKEN, {expiresIn: "7d"});
      const isProduction = process.env.NODE_ENV === "PRODUCTION";
      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      res.cookie('auth','email' , {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      
      res.send({ message: "Login successful", accessToken });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send("Server error");
    }
};

const signupUser = async (req, res) => {
    try {
      const { name,email, password } = req.body;
  
      // 1. Check if user already exists
      const result = await pool.query('SELECT * FROM users WHERE email = $1 ', [email]);
  
      if (result.rows.length > 0) {
        return res.status(409).send({message : "User already exists"});    
      }
  
      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 3. Insert user into database
      await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
  
      // 4. Send verification email
      sendVerificationMail(email)
      res.send({ message: "Sign-up successful" });
  
    } catch (error) {
      console.error("Signup error:", error);   
    }
};

const checkGoogleAuthentication = (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
}
const handleGoogleLogout = (req, res) => {
  const auth = req.cookies.auth;
  const isProduction = process.env.NODE_ENV === "PRODUCTION";
  if (auth === 'google') {
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',            // must match the path it was set with
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    res.clearCookie('auth', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    req.logout(() => {});
    res.send({message:"logout successfull"})
  }
  else{
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',            // must match the path it was set with
    });
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    res.clearCookie('auth', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    res.send({message:"logout successfull"})
  }
}

const handleTokenRefresh = (req,res) =>{
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Refresh token not found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, async(err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid refresh token");
    }
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.user_id]);
    const user = result.rows[0];
    const accessToken = jwt.sign({ user_id: user.user_id , email : user.email , name : user.name , profile_image : user.profile_image , role : user.role , is_verified : user.is_verified , created_at : user.created_at  }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "15m"
    });
    const isProduction = process.env.NODE_ENV === "PRODUCTION";
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    })
    res.send({message : 'accessTokenRefreshed'})
    
  })
}

const sendOTP = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";
  const email = req.body.email;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    return res.status(404).send("User not found");
  }
  if (result.rows[0].auth_provider === 'google'){
    return res.status(403).send("User not registered with this method");
  }
  sendOTPMail(email);
  res.cookie('email', encodeURIComponent(email),
  { 
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000
  });
  res.send({message : "OTP sent successfully"});
}
const verifyOTP = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";
  const otp = req.body.otp;
  const email = decodeURIComponent(req.cookies.email);
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(otp, user.otp_hash);
  if (!isMatch) {
    return res.status(401).send("Incorrect OTP");
  }
  res.cookie('resetToken', encodeURIComponent(user.reset_token),
  { 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000
  });
  await pool.query('UPDATE users SET otp_hash = $1, otp_expires = $2 WHERE email = $3', [null, null, email]);
  return res.status(200).send({message : "OTP verified successfully"});
}
const changePassword = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";
  const resetToken = decodeURIComponent(req.cookies.resetToken);
  const newPassword = req.body.newPassword;
  const result = await pool.query('SELECT * FROM users WHERE reset_token = $1', [resetToken]);
  const user = result.rows[0];
  if (!user) {
    return res.status(404).send("User not found");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash = $1, reset_token = null WHERE reset_token = $2', [hashedPassword, resetToken]);
  res.clearCookie('email', {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
  res.clearCookie('resetToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
  return res.send({message : "Password changed successfully"});
}

module.exports = {
    loginUser,
    signupUser,
    checkGoogleAuthentication,
    handleGoogleLogout,
    handleTokenRefresh,
    sendOTP,
    verifyOTP,
    changePassword
    
}