// src/routes/categories.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');

// Route to list categories owned by the logged-in user
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const userId = req.user._id; // Get the user's ID
        const categories = await db.collection('categories').find({ userId }).toArray();

        res.render('categories', { categories });
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).send("Error retrieving categories");
    }
});

// Route to render the form for creating a new category
router.get('/new', (req, res) => {
    try {
        res.render('newCategoryForm'); // Assuming you have a view file named 'newCategoryForm'
    } catch (error) {
        console.error("Error rendering new category form:", error);
        res.status(500).send("Error rendering new category form");
    }
});

// Route to handle the creation of a new category
router.post('/new', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const { name, description } = req.body;
        const userId = req.user._id; // Get the user's ID
        await db.collection('categories').insertOne({ userId, name, description });

        res.redirect('/categories');
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send("Error creating category");
    }
});

// Route to handle the deletion of a specific category
router.post('/delete/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const categoryId = req.params.id; // Get the category ID from the request parameters
        await db.collection('categories').deleteOne({ _id: new ObjectId(categoryId) }); // Construct ObjectId using new

        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Error deleting category");
    }
});

// Route to render the form for editing a category
router.get('/edit/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const categoryId = req.params.id; // Get the category ID from the request parameters
        const category = await db.collection('categories').findOne({ _id: new ObjectId(categoryId) }); // Construct ObjectId using new

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render('editCategoryForm', { category });
    } catch (error) {
        console.error("Error rendering edit category form:", error);
        res.status(500).send("Error rendering edit category form");
    }
});

// Route to handle the deletion of a specific category
router.post('/delete/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const db = getDB();
        const categoryId = req.params.id; // Get the category ID from the request parameters

        // Delete the category from the categories collection
        await db.collection('categories').deleteOne({ _id: new ObjectId(categoryId) });

        // Update all transactions that have the deleted category attached
        await db.collection('transactions').updateMany(
            { category: new ObjectId(categoryId) },
            { $unset: { category: '' } } // Remove the reference to the deleted category
        );

        // Update transactions payload to replace category id with empty string
        const transactions = await db.collection('transactions').find({}).toArray();
        transactions.forEach(async (transaction) => {
            if (transaction.category && transaction.category.toString() === categoryId) {
                await db.collection('transactions').updateOne(
                    { _id: transaction._id },
                    { $set: { category: '' } }
                );
            }
        });

        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Error deleting category");
    }
});

module.exports = router;
