const Issue = require('../models/Issue');

// Fetch all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort('-createdAt');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update issue status
exports.updateStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = req.body.status;
    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};