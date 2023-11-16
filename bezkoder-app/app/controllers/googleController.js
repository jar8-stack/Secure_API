const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const express = require('express');
const googleAuth = require('../dal/google-auth.dal');
const router = express.Router();
require('dotenv').config();

let userProfile;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/error' }),
  (req, res) => {
    res.redirect('/auth/google/success');
  }
);

router.get('/success', async (req, res) => {
  try {
    const { failure, success } = await googleAuth.registerWithGoogle(userProfile);
    if (failure) {
      console.log('Google user already exists in the DB..');
    } else {
      console.log('Registering new Google user..');
    }
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('Error in Google registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/error', (req, res) => res.status(401).json({ message: 'Error logging in via Google' }));

router.get('/signout', (req, res) => {
  try {
    req.logout(); // Destroy the login session
    res.redirect('/auth'); // Redirect to the authentication page
  } catch (error) {
    console.error('Failed to sign out user:', error);
    res.status(400).json({ message: 'Failed to sign out user' });
  }
});

module.exports = router;
