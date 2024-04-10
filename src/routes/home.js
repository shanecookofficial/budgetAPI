// src/routes/home.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');

router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: req.user._id });
        const displayName = user.preferredName || user.name;

        // Pass displayName to the home view
        res.render('home', { displayName });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).send("Error retrieving user data");
    }
});

module.exports = router;
