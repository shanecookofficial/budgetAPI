const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('./src/config/passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./src/routes');
const path = require('path');
const { connectDB } = require('./src/db/connect');
const MongoDBStore = require('connect-mongodb-session')(session);

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'src')));

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

connectDB()
    .then(() => {
        console.log('Connected to MongoDB');
        app.use(passport.initialize());
        app.use(passport.session());
        app.use('/', routes);
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server started on Port: ${PORT}`);
});

module.exports = server;
