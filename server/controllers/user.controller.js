const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const config = require('../config/default');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserRoadmapProgress = require('../models/UserRoadmapProgress.model');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(2);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ ...userResponse, message: 'User registeration successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user has any active roadmaps
        const noRoadmapFollowed = !user.activeRoadmaps || user.activeRoadmaps.length === 0;

        const payload = {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    message: "Login Successful",
                    noRoadmapFollowed: noRoadmapFollowed ? user.activeRoadmaps : false,
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

const userDetail = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('activeRoadmaps.roadmapId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

// Get user XP and streak data
const getUserXpData = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('xp dailyStreak lastActivityDate');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get streak activity data for the past 3 months (for GitHub-style heatmap)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const activityData = await UserRoadmapProgress.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    'topicCompletions.completedAt': { $gte: threeMonthsAgo }
                }
            },
            { $unwind: '$topicCompletions' },
            {
                $match: {
                    'topicCompletions.completedAt': { $gte: threeMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$topicCompletions.completedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return res.status(200).json({
            xp: user.xp || 0,
            level: Math.floor((user.xp || 0) / 100) + 1,
            streak: user.dailyStreak || 0,
            lastActivityDate: user.lastActivityDate,
            activityData
        });
    } catch (error) {
        console.error('Error fetching user XP data:', error);
        return res.status(500).json({ message: 'Failed to fetch user XP data' });
    }
};

module.exports = {
    createUser,
    loginUser,
    userDetail,
    getUserXpData
}