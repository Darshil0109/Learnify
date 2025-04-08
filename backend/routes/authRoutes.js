const express = require("express");
const router = express.Router();
const { signupUser, loginUser, checkGoogleAuthentication, handleGoogleLogout, handleTokenRefresh } = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// route to get user's google accounts available for authentication
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


// route to handle the callback from google
router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: process.env.CLIENT_URL + '/',
    }),
    (req,res)=>{
      const isProduction = process.env.NODE_ENV === "PRODUCTION";
      const user =req.user;
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
      });
      res.cookie('auth','google' , {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      res.redirect(process.env.CLIENT_URL + '/profile');
    }
);

router.post('/refresh-token',handleTokenRefresh);

// route to handle user logout
router.post('/logout', handleGoogleLogout);

// route to check user's authentication
router.get('/user', checkGoogleAuthentication); 

//routes to signup and login 
router.post('/signup', signupUser);
router.post('/login', loginUser);

module.exports = router;