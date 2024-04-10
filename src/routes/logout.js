// logout.js
const express = require('express');
const router = express.Router();

// Logout route
router.get('/', (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;
