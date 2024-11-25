const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const express = require("express");
const passport = require("./config/passport-setup");
const axios = require("axios");
const connectDB = require("./connection/db");
const User = require("../models/users");

const app = express();
const PORT = 3000 || process.env.PORT;

connectDB();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", require("./routes"));

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`, // Ensure BASE_URL is defined in your .env file
    },
    async function (accessToken, refreshToken, profile, done) {
      let user = await User.findOrCreate(
        { googleId: profile.id },
        function (error, user) {
          return done(error, user);
        }
      );
    }
  )
);

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
    secret: process.env.SESSION_SECRET || "your-session-secret",
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
