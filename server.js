const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const express = require("express");
const passport = require("./config/passport-setup");
const axios = require("axios");
const connectDB = require("./connection/db");

const app = express();
const PORT = 3000 || process.env.PORT;

connectDB();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", require("./routes"));

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
