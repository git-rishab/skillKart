const DiscussionThreadSchema = new mongoose.Schema({
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapTemplate' },
    weekNumber: Number,
    topicTitle: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question: String,
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answer: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('DiscussionThread', DiscussionThreadSchema);
