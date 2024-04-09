const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

// Mount auth routes
router.use('/auth', require('./auth'));

// Mount profile and logout routes
router.use(require('./profile'));
router.use(require('./logout')); // No need for '/logout' here

module.exports = router;
