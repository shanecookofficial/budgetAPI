// src/tests/db.test.js

const { connectDB, getDB } = require('../db/connect');

describe('DB Connection', () => {
    beforeAll(async () => {
        // Mock the database connection
        jest.spyOn(require('mongodb'), 'MongoClient').mockImplementation(() => ({
            connect: jest.fn().mockResolvedValue(),
            db: jest.fn().mockReturnValue({}),
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
    });
});
