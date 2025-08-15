const express = require('express');
const upload = require('../utils/upload');
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/issueController');

const router = express.Router();
router.use(protect);

router.post('/', upload.single('photo'), ctrl.createIssue);
router.get('/', ctrl.getIssues);
router.get('/:id', ctrl.getIssue);
router.put('/:id', upload.single('photo'), ctrl.updateIssue);
router.delete('/:id', ctrl.deleteIssue);
router.patch('/:id/status', ctrl.updateStatus);
router.get('/', ctrl.getAllIssues);


module.exports = router;