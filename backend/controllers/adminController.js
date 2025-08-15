const Issue = require('../models/Issue');

// Fetch all issues
exports.getAllIssues1 = async (req, res) => {
  try {
    const issues = await Issue.find().sort('-createdAt');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update issue status
exports.updateStatus1 = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = req.body.status;   // ✅ must receive { status: "DONE" }
    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};