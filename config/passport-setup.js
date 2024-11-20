const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("keys");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Token management utilities
const TokenManager = {
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      throw new Error("Failed to refresh access token");
    }
  },

  isTokenExpired(expiryTime) {
    // Add 5 minute buffer before actual expiry
    return Date.now() >= expiryTime - 300000;
  },
};

// Middleware to check and refresh token if needed
const ensureFreshToken = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    if (TokenManager.isTokenExpired(req.user.tokenExpiryTime)) {
      const { accessToken, expiresIn } = await TokenManager.refreshAccessToken(
        req.user.refreshToken
      );

      // Update user session with new token info
      req.user.accessToken = accessToken;
      req.user.tokenExpiryTime = Date.now() + expiresIn * 1000;

      // Here you would typically also update the token in your database
      // await updateUserTokenInDatabase(req.user.id, accessToken, req.user.tokenExpiryTime);
    }
    next();
  } catch (error) {
    // If refresh fails, redirect to re-authenticate
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/auth/google");
    });
  }
};

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:3000/auth/google/dashboard",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      //passport callback function
      console.log("passport callback function fired");
      console.log(profile);
      try {
        const user = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          // picture: profile.photos[0].value,
          accessToken,
        };

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
};

module.exports = {
  TokenManager,
  ensureFreshToken,
  isAuthenticated,
};
