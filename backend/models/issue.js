const mongoose = require('mongoose');


const IssueSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['POTHOLE', 'STREETLIGHT', 'OTHER'], required: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
    photoUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

IssueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', IssueSchema);