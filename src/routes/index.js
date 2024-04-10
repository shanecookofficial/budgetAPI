// src/routes/index.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.send('<a href="/auth/google">Authenticate with Google</a>');
    }
});

router.use('/auth', require('./auth'));
router.use('/logout', require('./logout'));
router.use('/home', require('./home'));
router.use('/profile', require('./profile')); // Add this line to use the profile route

module.exports = router;
