const express = require('express');
const ctrl = require('../controllers/adminController');

const router = express.Router();

// Get all issues
router.get('/issues1', ctrl.getAllIssues);

// Update issue status
router.patch('/issue1s/:id/status', ctrl.updateStatus);

module.exports = router;