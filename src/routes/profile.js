// src/routes/profile.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');

// Profile route
router.get('/profile', async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        const db = getDB();
        const user = await db.collection('users').findOne({ _id: req.user._id });
        const displayName = user.preferredName || user.name; // Use preferredName if it exists, otherwise default to name

        res.send(`
            <h1>Hello, ${displayName}!</h1>
            <form action="/profile/update-preferred-name" method="POST">
                <label for="preferredName">Update Preferred Name:</label>
                <input type="text" id="preferredName" name="preferredName">
                <button type="submit">Submit</button>
            </form>
            <a href="/logout">Logout</a>
            <form action="/profile/delete" method="POST"><button type="submit">Delete Account</button></form>
        `);
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).send("Error retrieving user data");
    }
});

// Update preferred name route (POST method)
router.post('/profile/update-preferred-name', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }

    const preferredName = req.body.preferredName;

    try {
        const db = getDB();
        const user = await db.collection('users').findOneAndUpdate(
            { _id: req.user._id },
            { $set: { preferredName: preferredName || req.user.name } },
            { returnOriginal: false }
        );

        res.redirect('/profile');
    } catch (error) {
        console.error("Error updating preferred name:", error);
        res.status(500).send("Error updating preferred name");
    }
});

// Delete account route
router.post('/profile/delete', async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    try {
        const db = getDB();
        await db.collection('users').deleteOne({ _id: req.user._id });

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
