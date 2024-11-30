const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const connectDB = require("./connection/db");
const User = require("./models/Users");
const PORT = 3000 || process.env.PORT;

const session = require("express-session");
// const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(passport.initialize());

connectDB();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", require("./routes"));

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`, // Ensure BASE_URL is defined in your .env file
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let user = User.findOrCreate(
        { googleId: profile.id },
        function (error, user) {
          return done(error, user);
        }
      );
    }
  )
);

passport.use(User.createStrategy());

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Session middleware configuration
app.use(
  session({
    secret:
      process.env.JWT_SECRET ||
      "63094057af57b976d68cd2b58d6c93b2a3db9c6bb894173124f6289afa8f40ca6fd9aac18acb3771fa6995c9e75af271c111feb6d3f3f82c7bfa0d06f4045baf",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
