const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
    try {
        const { title, description, type, address, lat, lng } = req.body;
        if (!title || !type) return res.status(400).json({ message: 'title and type are required' });
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const doc = await Issue.create({
            title, description, type, address,
            location: { type: 'Point', coordinates: [Number(lng) || 0, Number(lat) || 0] },
            photoUrl, createdBy: req.user.id
        });
        res.status(201).json(doc);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getIssues = async (req, res) => {
    try {
        const { type, status, q, nearLat, nearLng, radius = 2000 } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { address: new RegExp(q, 'i') }];
        if (nearLat && nearLng) {
            filter.location = { $near: { $geometry: { type: 'Point', coordinates: [Number(nearLng), Number(nearLat)] }, $maxDistance: Number(radius) } };
        }
        const data = await Issue.find(filter).sort('-createdAt');
        res.json(data);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getIssue = async (req, res) => {
    try {
        const data = await Issue.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateIssue = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) updates.photoUrl = `/uploads/${req.file.filename}`;
        if (updates.lat || updates.lng) {
            updates.location = { type: 'Point', coordinates: [Number(updates.lng) || 0, Number(updates.lat) || 0] };
            delete updates.lat; delete updates.lng;
        }
        const data = await Issue.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteIssue = async (req, res) => {
    try {
        const data = await Issue.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const data = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (e) { res.status(500).json({ message: e.message }); }
};