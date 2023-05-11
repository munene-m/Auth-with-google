const User = require('./models/User')

const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

require('dotenv').config()
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try{
        const user  = await User.findOrCreate({ googleId: profile.id },{
            email: profile.email,
            username: profile.displayName,
        })
        return done(null, {
          id: user._id,
          email: user.email,
          username: user.username,
          googleId: user.googleId
        });
    } catch (error) {
        return done(error)
    }

  }
)); 

passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(async function(id, done) {
    const user = await User.findById(id);
    done(null, user);
  });
  

  module.exports = passport 