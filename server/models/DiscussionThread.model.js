const mongoose = require('mongoose');

const DiscussionThreadSchema = new mongoose.Schema({
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapTemplate' },
    weekNumber: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question: String,
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answer: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('DiscussionThread', DiscussionThreadSchema);
