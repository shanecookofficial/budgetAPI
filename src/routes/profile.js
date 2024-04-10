// src/routes/profile.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');

// Profile route
router.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user.name}! <a href="/logout">Logout</a> <form action="/profile/delete" method="POST"><button type="submit">Delete Account</button></form>`);
});

// Delete account route
router.post('/profile/delete', async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    try {
        const db = getDB();
        await db.collection('users').deleteOne({ _id: req.user._id });

        // Logout the user
        req.logout((err) => {
            if (err) {
                console.error("Error logging out user:", err);
                return res.status(500).send("Error logging out user");
            }
            req.session.destroy(() => {
                res.redirect('/');
            });
        });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).send("Error deleting user account");
    }
});

module.exports = router;
