const mongoose = require('mongoose');

const UserRoadmapProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    roadmapId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RoadmapTemplate' },
    topicCompletions: [
        {
            topicId: { type: mongoose.Schema.Types.ObjectId, required: true },
            isCompleted: { type: Boolean, default: false },
            completedAt: { type: Date }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('UserRoadmapProgress', UserRoadmapProgressSchema);
