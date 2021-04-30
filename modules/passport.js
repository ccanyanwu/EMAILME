//googleauth
const mongoose = require('mongoose');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model('users');
//serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
})

//deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      //check if user already exists
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) { return done(null, existingUser) }
      
            //create a new user
      const user = await new User({ googleId: profile.id }).save()
      done(null, user);
      
    }
  )
);
