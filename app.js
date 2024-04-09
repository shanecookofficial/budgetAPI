// app.js

const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('./src/config/passport');
const routes = require('./src/routes');

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server;
