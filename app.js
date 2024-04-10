// app.js

const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('./src/config/passport');
const bodyParser = require('body-parser'); // Import body-parser middleware
const routes = require('./src/routes');
const { connectDB } = require('./src/db/connect'); // Correct import path

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

connectDB() // Call connectDB function first
    .then(() => {
        console.log('Connected to MongoDB');
        app.use(passport.initialize()); // Initialize Passport after database connection is established
        app.use(passport.session());
        app.use('/', routes);
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server;
