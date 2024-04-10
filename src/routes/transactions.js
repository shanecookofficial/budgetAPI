const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');

// Route to list transactions with optional filters
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const userId = req.user._id;
        let query = { userId };

        // Apply filters if provided
        if (req.query.category) {
            query.categoryId = req.query.category;
        }

        // Sorting options
        let sortOptions = {};
        if (req.query.sortByDate === 'asc') {
            sortOptions.datetime = 1;
        } else if (req.query.sortByDate === 'desc') {
            sortOptions.datetime = -1;
        } else if (req.query.sortByAmount === 'asc') {
            sortOptions.amount = 1;
        } else if (req.query.sortByAmount === 'desc') {
            sortOptions.amount = -1;
        }

        const transactions = await db.collection('transactions').find(query).sort(sortOptions).toArray();

        // Fetch categories
        const categories = await db.collection('categories').find({ userId }).toArray();

        // Create a map of category IDs to category names for faster lookup
        const categoryMap = new Map();
        categories.forEach(category => {
            categoryMap.set(category._id.toString(), category.name);
        });

        // Fetch category names for each transaction
        transactions.forEach(transaction => {
            if (transaction.categoryId) {
                const categoryName = categoryMap.get(transaction.categoryId.toString());
                transaction.categoryName = categoryName || "No category";
            } else {
                transaction.categoryName = "No category";
            }
        });

        // Render the transactions page with transactions data and categories
        res.render('transactions', { transactions, categories, req });
    } catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).send("Error retrieving transactions");
    }
});


// Route to render the form for creating a new transaction
router.get('/new', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const userId = req.user._id;
        const categories = await db.collection('categories').find({ userId }).toArray();

        res.render('newTransactionForm', { categories });
    } catch (error) {
        console.error("Error rendering new transaction form:", error);
        res.status(500).send("Error rendering new transaction form");
    }
});

// Route to handle the creation of a new transaction
router.post('/new', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const { account, description, categoryId, amount, datetime, type } = req.body;
        const userId = req.user._id;
        await db.collection('transactions').insertOne({ userId, account, description, categoryId, amount, datetime, type });

        res.redirect('/transactions');
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).send("Error creating transaction");
    }
});

// Route to render the form for editing a transaction
router.get('/edit/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const transactionId = req.params.id;
        const transaction = await db.collection('transactions').findOne({ _id: new ObjectId(transactionId) });

        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }

        // Ensure transaction.datetime is a valid Date object
        if (!(transaction.datetime instanceof Date)) {
            transaction.datetime = new Date(transaction.datetime);
        }

        const userId = req.user._id;
        const categories = await db.collection('categories').find({ userId }).toArray();

        res.render('editTransactionForm', { transaction, categories });
    } catch (error) {
        console.error("Error rendering edit transaction form:", error);
        res.status(500).send("Error rendering edit transaction form");
    }
});

// Route to handle the update of a specific transaction
router.post('/edit/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const transactionId = req.params.id;
        const { account, description, categoryId, amount, datetime, type } = req.body;
        
        // Update the transaction in the database
        await db.collection('transactions').updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { account, description, categoryId, amount, datetime, type } }
        );

        res.redirect('/transactions');
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).send("Error updating transaction");
    }
});

// Route to handle the deletion of a specific transaction
router.post('/delete/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const transactionId = req.params.id;
        await db.collection('transactions').deleteOne({ _id: new ObjectId(transactionId) });

        res.redirect('/transactions');
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).send("Error deleting transaction");
    }
});

module.exports = router;
