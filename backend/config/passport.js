const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const { sendVerificationMail } = require('../services/sendVerificationMail');
const jwt = require('jsonwebtoken');
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  const email = emails[0].value;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if(result.rows.length > 0 ){
        if(result.rows[0].auth_provider === profile.provider){
            return done(null , result.rows[0]);
        }
        else{
            return done(new Error('User registered with different method'),null)
        }
    }
    else{
        const newUser = await pool.query(
            'INSERT INTO users (auth_id, name, email , is_verified , profile_image , auth_provider) VALUES ($1, $2, $3 , $4 , $5 , $6) RETURNING *',
            [id, displayName, email , profile.emails[0].verified , profile.photos[0].value , profile.provider]
        );
        return done(null, newUser.rows[0]);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
    done(null, user.user_id); // use the actual column name from your DB
});
passport.deserializeUser(async (user_id, done) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

  

module.exports = passport;