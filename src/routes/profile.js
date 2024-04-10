// src/routes/profile.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');

// Profile route
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: req.user._id });
        const displayName = user.preferredName || user.name;

        res.render('profile', { displayName, preferredName: user.preferredName });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).send("Error retrieving user data");
    }
});

// Update preferred name route
router.post('/update-preferred-name', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const { preferredName } = req.body;
        const db = getDB();
        const user = await db.collection('users').findOneAndUpdate(
            { _id: req.user._id },
            { $set: { preferredName } },
            { returnOriginal: false }
        );

        res.redirect('/profile');
    } catch (error) {
        console.error("Error updating preferred name:", error);
        res.status(500).send("Error updating preferred name");
    }
});

// Delete account route
router.post('/delete', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const db = getDB();
        await db.collection('users').deleteOne({ _id: req.user._id });

        // Logout the user
        req.logout(() => {
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
