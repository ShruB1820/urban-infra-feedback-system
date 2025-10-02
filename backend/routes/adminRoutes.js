const express = require('express');
const ctrl = require('../controllers/adminController');

const router = express.Router();

// Get all issues
router.get('/issues1', ctrl.getAllIssues1);

// Update issue status
router.patch('/issues1/:id/status', ctrl.updateStatus1);

module.exports = router;

// changes made
