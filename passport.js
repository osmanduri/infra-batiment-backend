require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile)
    console.log("token "+token)
    console.log("token secret "+tokenSecret)
    
    done(null, profile)
  }
));

passport.serializeUser((user , done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})