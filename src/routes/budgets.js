// src/routes/budgets.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Route to list budgets
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const userId = req.user._id;

        // Retrieve budgets from the database
        const budgets = await db.collection('budgets').find({ userId }).toArray();

        // Fetch transactions for each budget
        for (const budget of budgets) {
            const transactions = await db.collection('transactions').find({ userId, categoryId: budget.category }).toArray();
            budget.transactions = transactions;
            // Calculate total spent for the budget
            budget.totalSpent = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

            // Retrieve category details
            const category = await db.collection('categories').findOne({ _id: new ObjectId(budget.category) });
            if (category) {
                budget.categoryName = category.name; // Assign category name to the budget object
            }
        }

        // Render the budgets view and pass the budgets data
        res.render('budgets', { budgets, formatDate });
    } catch (error) {
        console.error("Error retrieving budgets:", error);
        res.status(500).send("Error retrieving budgets");
    }
});

// Route to render the form for creating a new budget
router.get('/new', async (req, res) => {
    try {
        const db = getDB();
        const userId = req.user._id;

        // Retrieve categories from the database
        const categories = await db.collection('categories').find({ userId }).toArray();

        // Render the newBudgetForm view and pass the categories data
        res.render('newBudgetForm', { categories });
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).send("Error retrieving categories");
    }
});


// Route to handle the creation of a new budget
router.post('/new', async (req, res) => {
    try {
        const db = getDB();
        const { category, startDate, endDate, amount } = req.body;
        const userId = req.user._id;

        // Validate if category is provided
        if (!category) {
            return res.status(400).send('Category is required');
        }

        // Insert the new budget into the database
        await db.collection('budgets').insertOne({ userId, category, startDate, endDate, amount });

        // Redirect to the budgets route after creating the budget
        res.redirect('/budgets');
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).send("Error creating budget");
    }
});

// Route to handle the deletion of a budget
router.post('/delete/:id', async (req, res) => {
    try {
        const db = getDB();
        const userId = req.user._id;
        const budgetId = req.params.id;

        // Delete the budget from the database
        await db.collection('budgets').deleteOne({ _id: new ObjectId(budgetId), userId });

        // Redirect to the budgets route after deleting the budget
        res.redirect('/budgets');
    } catch (error) {
        console.error("Error deleting budget:", error);
        res.status(500).send("Error deleting budget");
    }
});

module.exports = router;
