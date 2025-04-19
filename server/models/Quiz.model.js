const QuizSchema = new mongoose.Schema({
    title: String,
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapTemplate' },
    weekNumber: Number,
    topicTitle: String,
    questions: [{
        questionText: String,
        options: [String],
        correctAnswerIndex: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
