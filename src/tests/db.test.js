// src/tests/db.test.js

const { connectDB, getDB } = require('../db/connect');
const mongodb = require('mongodb');

describe('DB Connection', () => {
    let mongoClientSpy;

    beforeAll(async () => {
        // Mock the database connection
        mongoClientSpy = jest.spyOn(mongodb, 'MongoClient').mockImplementation(() => ({
            connect: jest.fn().mockResolvedValue(),
            db: jest.fn().mockReturnValue({}),
            close: jest.fn(), // Ensure you mock the close function if it might be called
        }));

        // Call connectDB before running the tests
        await connectDB();
    });

    it('should connect to the database successfully', async () => {
        const db = getDB();
        expect(db).toBeDefined();
    });

    it('should get the database object', () => {
        const db = getDB();
        expect(db).toBeDefined();
    });

    afterAll(() => {
        // Restore the original implementation after all tests
        jest.restoreAllMocks();

        // Explicitly close the database connection if your connectDB function supports it
        // This step is crucial if your mock or actual implementation involves setting up connections or listeners
        if (mongoClientSpy.close) {
            mongoClientSpy.close();
        }
    });
});
