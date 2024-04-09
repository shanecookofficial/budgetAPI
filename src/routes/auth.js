const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google authentication route
router.get('/google',
    passport.authenticate('google', { scope: ['profile'] })
);

// Google callback route
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

module.exports = router;
