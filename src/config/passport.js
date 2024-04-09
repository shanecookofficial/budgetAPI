const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.googleId);
});

passport.deserializeUser(async (googleId, done) => {
    try {
        const db = require('../db/connect').getDB();
        const user = await db.collection('users').findOne({ googleId });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const db = require('../db/connect').getDB();
        let user = await db.collection('users').findOne({ googleId: profile.id });

        if (!user) {
            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
            };
            await db.collection('users').insertOne(newUser);
            user = newUser;
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

module.exports = passport;
