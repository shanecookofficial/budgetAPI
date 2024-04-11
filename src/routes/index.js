const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express
const swaggerDocument = require('../../swagger.json'); // Import your swagger.json file

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.send('<a href="/auth/google">Authenticate with Google</a>');
    }
});

router.use('/auth', require('./auth'));
router.use('/logout', require('./logout'));
router.use('/home', require('./home'));
router.use('/profile', require('./profile'));
router.use('/categories', require('./categories'));
router.use('/transactions', require('./transactions'));
router.use('/budgets', require('./budgets'));

// Serve Swagger UI documentation at /api-docs route
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
