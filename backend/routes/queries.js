const express = require('express');
const router = express.Router();
const { submitQuery, getQueries, updateQueryStatus, deleteQuery } = require('../controllers/queryController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route for submitting a contact form query
router.post('/', submitQuery);

// Admin routes for managing queries
router.get('/', protect, adminOnly, getQueries);
router.put('/:id', protect, adminOnly, updateQueryStatus);
router.delete('/:id', protect, adminOnly, deleteQuery);

module.exports = router;
