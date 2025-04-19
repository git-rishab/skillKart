const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['learner', 'admin'], default: 'learner' },

    xp: { type: Number, default: 0 },

    // interests: [{
    //     type: String,
    //     enum: [
    //         'Web Development',
    //         'UI/UX Design',
    //         'Data Science',
    //         'Mobile App Development',
    //         'DevOps',
    //         'Cybersecurity',
    //         'AI/ML',
    //         'Cloud Computing'
    //     ]
    // }],

    // goals: [{
    //     type: String,
    //     enum: [
    //         'Get a job',
    //         'Start freelancing',
    //         'Build a portfolio project',
    //         'Learn fundamentals',
    //         'Crack interviews',
    //         'Switch career'
    //     ]
    // }],

    // weeklyAvailableTime: {
    //     type: Number, // hours per week
    //     min: 1,
    //     max: 40
    // },

    dailyStreak: {
        currentStreak: { type: Number, default: 0 },
        lastStreakDate: { type: Date, default: null }
    },


    badges: [{
        type: String,
        enum: [
            "Trailblazer",             // First login or roadmap started
            "Week One Warrior",        // Completed Week 1
            "Mastermind",              // Completed full roadmap
            "Knowledge Ninja",         // Completed 10 topics
            "Skill Samurai",           // Reached 500 XP
            "Discussion Dynamo",       // Active in forums
            "Curiosity Catalyst",      // Explored all resources in a week
            "Badge Collector",         // Earned 5+ badges
        ]

    }],
    activeRoadmaps: [
        {
            roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapTemplate' },
            startedAt: { type: Date, default: Date.now },
            currentWeek: { type: Number, default: 1 },
            progress: [
                {
                    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapTemplate.modules' },
                    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
                }
            ]
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
