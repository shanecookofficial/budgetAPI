const express = require('express');
const router = express.Router();

// Logout route
router.get('/logout', (req, res) => { // Remove '/logout' from here
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;
