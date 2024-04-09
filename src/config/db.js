const { connectDB, getDB } = require('../db/connect');
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

module.exports = {
    getDB
};
