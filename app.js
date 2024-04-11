const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('./src/config/passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./src/routes');
const path = require('path');
const { connectDB } = require('./src/db/connect');

dotenv.config();

const app = express();

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

// Set the path to the views directory
app.set('views', path.join(__dirname, 'src', 'views'));

// Set 'ejs' as the view engine
app.set('view engine', 'ejs');

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Use method-override middleware
app.use(methodOverride('_method'));

// Connect to the database
connectDB()
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
