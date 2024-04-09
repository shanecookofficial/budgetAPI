const express = require('express');
const router = express.Router();

// Profile route
router.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user.displayName}! <a href="/logout">Logout</a>`);
});

module.exports = router;
