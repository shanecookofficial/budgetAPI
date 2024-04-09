// src/db/connect.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(process.env.DB_NAME);

        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first!');
    }
    return db;
};

module.exports = { connectDB, getDB };
