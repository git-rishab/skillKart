const RoadmapTemplate = require('../models/RoadmapTemplate.model');
const UserRoadmapProgress = require('../models/UserRoadmapProgress.model');
const User = require('../models/User.model');

const generatePersonalizedRoadmap = async (req, res) => {
    try {
        const { interest, goals, availableWeeklyTime } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!interest || !goals || !availableWeeklyTime) {
            return res.status(400).json({ message: "Interest, goals, and weekly time are required." });
        }

        // Extract min and max values from availableWeeklyTime
        const { min, max } = availableWeeklyTime;

        // Step 1: Find roadmap templates that match the user's interest and goals
        const roadmaps = await RoadmapTemplate.find({
            interest: interest,
            goalTags: { $in: goals }, // Match at least one goal tag
        });

        // Step 2: Filter roadmaps by available weekly time
        const personalizedRoadmaps = roadmaps.filter((roadmap) => {
            // Calculate the total estimated time for the roadmap (in hours)
            const totalEstimatedTime = roadmap.modules.reduce((total, module) => {
                return total + module.topics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
            }, 0);

            // Convert total estimated time into weeks based on the user input
            const totalWeeks = Math.ceil(totalEstimatedTime / min); // Convert total time to weeks based on the min available time

            // Check if the roadmap's estimated weeks are within the range of user's available time
            const fitsWeeklyTimeRange = max === "Infinity"
                ? totalWeeks >= Math.ceil(totalEstimatedTime / min) // if max is infinity, ignore max constraint
                : totalWeeks >= Math.ceil(totalEstimatedTime / min) && totalWeeks <= Math.ceil(totalEstimatedTime / max);

            return fitsWeeklyTimeRange && totalWeeks <= roadmap.estimatedWeeks; // Ensure the roadmap's estimated weeks do not exceed available weeks
        });

        // Step 3: If no roadmaps found for the exact available weekly time, find the closest match
        if (personalizedRoadmaps.length === 0) {
            // Find the closest roadmap by checking the difference in available weekly time
            const closestRoadmap = roadmaps.reduce((closest, roadmap) => {
                const totalEstimatedTime = roadmap.modules.reduce((total, module) => {
                    return total + module.topics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
                }, 0);

                const totalWeeks = Math.ceil(totalEstimatedTime / min);

                // Calculate difference between the required weeks and the roadmap's estimated weeks
                const difference = Math.abs(totalWeeks - Math.ceil(totalEstimatedTime / min));

                // Choose the closest match
                if (!closest || difference < closest.difference) {
                    return { roadmap, difference };
                }
                return closest;
            }, null);

            if (closestRoadmap) {
                personalizedRoadmaps.push(closestRoadmap.roadmap);
            }
        }

        // Step 4: Update the user's activeRoadmaps with the personalized roadmap
        if (personalizedRoadmaps.length > 0) {
            const selectedRoadmap = personalizedRoadmaps[0]; // Select the first matching roadmap

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if the user is already following this roadmap
            const alreadyFollowing = user.activeRoadmaps.some(r =>
                r.roadmapId.toString() === selectedRoadmap._id.toString()
            );

            if (!alreadyFollowing) {
                // Initialize with empty progress array (not empty string)
                user.activeRoadmaps.push({
                    roadmapId: selectedRoadmap._id,
                    startedAt: new Date(),
                    progress: []
                });

                await user.save();
            }
        }

        return res.status(200).json({
            message: "Personalized roadmap generated successfully.",
            roadmaps: personalizedRoadmaps.map((roadmap) => ({
                _id: roadmap._id,
                title: roadmap.title,
                interest: roadmap.interest,
                goalTags: roadmap.goalTags,
                modules: roadmap.modules.map((module) => ({
                    weekNumber: module.moduleNumber,
                    topics: module.topics.map((topic) => ({
                        title: topic.title,
                        description: topic.description,
                        estimatedTime: topic.estimatedTime,
                        resources: topic.resources,
                    })),
                })),
            })),
            activeRoadmaps: user.activeRoadmaps
        });
    } catch (error) {
        console.error("Error generating personalized roadmap: ", error);
        return res.status(500).json({ message: "An error occurred while generating the roadmap." });
    }
};

const markTopicComplete = async (req, res) => {
    try {
        const { roadmapId, topicId } = req.body;
        const userId = req.user._id;

        const [roadmap, user] = await Promise.all([
            RoadmapTemplate.findById(roadmapId),
            User.findById(userId)
        ]);
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

        const topicExists = roadmap.modules.some(module =>
            module.topics.some(topic => topic._id.toString() === topicId)
        );
        if (!topicExists) return res.status(404).json({ message: "Topic not found in roadmap" });

        let progress = await UserRoadmapProgress.findOne({ userId, roadmapId });
        if (!progress) {
            progress = new UserRoadmapProgress({ userId, roadmapId, topicCompletions: [] });
        }

        const alreadyCompleted = progress.topicCompletions.find(
            (entry) => entry.topicId.toString() === topicId && entry.isCompleted
        );
        if (alreadyCompleted) return res.status(400).json({ message: "Topic already completed" });

        const existingEntry = progress.topicCompletions.find(
            (entry) => entry.topicId.toString() === topicId
        );

        if (existingEntry) {
            existingEntry.isCompleted = true;
            existingEntry.completedAt = new Date();
        } else {
            progress.topicCompletions.push({
                topicId,
                isCompleted: true,
                completedAt: new Date()
            });
        }

        progress.updatedAt = new Date();
        await progress.save();

        // ⏱️ Daily streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const lastDate = user.dailyStreak?.lastStreakDate
            ? new Date(user.dailyStreak.lastStreakDate)
            : null;
        const lastDateStripped = lastDate
            ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
            : null;

        if (!lastDate) {
            user.dailyStreak = { currentStreak: 1, lastStreakDate: today };
        } else if (lastDateStripped.getTime() === yesterday.getTime()) {
            user.dailyStreak.currentStreak += 1;
            user.dailyStreak.lastStreakDate = today;
        } else if (lastDateStripped.getTime() !== today.getTime()) {
            user.dailyStreak.currentStreak = 1;
            user.dailyStreak.lastStreakDate = today;
        }

        user.xp += 5;

        const totalCompleted = await UserRoadmapProgress.aggregate([
            { $match: { userId: user._id } },
            { $unwind: "$topicCompletions" },
            { $match: { "topicCompletions.isCompleted": true } },
            { $count: "total" }
        ]);

        const completedCount = totalCompleted[0]?.total || 0;

        const badgeSet = new Set(user.badges);
        badgeSet.add("Trailblazer");
        if (!badgeSet.has("Knowledge Ninja") && completedCount >= 10) badgeSet.add("Knowledge Ninja");
        if (!badgeSet.has("Skill Samurai") && user.xp >= 500) badgeSet.add("Skill Samurai");
        if (!badgeSet.has("Badge Collector") && badgeSet.size >= 5) badgeSet.add("Badge Collector");

        user.badges = Array.from(badgeSet);

        // Instead of saving whole user document (which may include invalid activeRoadmaps.progress), update only specific fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                xp: user.xp,
                badges: user.badges,
                dailyStreak: user.dailyStreak
            },
            { new: true }
        );

        return res.json({
            message: "Topic marked complete",
            xp: updatedUser.xp,
            badges: updatedUser.badges,
            dailyStreak: updatedUser.dailyStreak
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const followRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.body;
        const userId = req.user._id;

        const roadmap = await RoadmapTemplate.findById(roadmapId);
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

        const user = await User.findById(userId);

        const alreadyFollowing = user.activeRoadmaps.some(r => r.roadmapId.toString() === roadmapId);
        if (alreadyFollowing) return res.status(400).json({ message: "Already following this roadmap" });

        // Initialize with proper empty progress array (not empty string)
        user.activeRoadmaps.push({
            roadmapId,
            startedAt: new Date(),
            progress: [] // Ensure this is an empty array, not an empty string
        });

        await user.save();

        return res.json({ message: "Successfully followed roadmap" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const roadmap = await RoadmapTemplate.findById(roadmapId);
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
        res.json(roadmap);
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get user's topic completion status for a specific roadmap
const getRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { roadmapId } = req.params;
        const progress = await UserRoadmapProgress.findOne({ userId, roadmapId });
        if (!progress) {
            return res.status(200).json({ topicCompletions: [] });
        }
        return res.status(200).json({ topicCompletions: progress.topicCompletions });
    } catch (error) {
        console.error('Error fetching roadmap progress:', error);
        return res.status(500).json({ message: 'Failed to fetch roadmap progress' });
    }
};

// Admin: Get all roadmaps
const getAllRoadmaps = async (req, res) => {
    try {
        const roadmaps = await RoadmapTemplate.find()
            .populate('createdBy', 'name email');
        return res.status(200).json(roadmaps);
    } catch (error) {
        console.error('Error fetching roadmaps:', error);
        return res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
};

// Admin: Update topic resources
const updateTopicResources = async (req, res) => {
    try {
        const { roadmapId, moduleIndex, topicIndex } = req.params;
        const { resources } = req.body;

        // Validate indices
        if (moduleIndex < 0 || topicIndex < 0) {
            return res.status(400).json({ message: 'Invalid module or topic index' });
        }

        const roadmap = await RoadmapTemplate.findById(roadmapId);
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        // Validate module and topic exist
        if (!roadmap.modules[moduleIndex] || !roadmap.modules[moduleIndex].topics[topicIndex]) {
            return res.status(404).json({ message: 'Module or topic not found' });
        }

        // Update resources
        roadmap.modules[moduleIndex].topics[topicIndex].resources = resources;
        await roadmap.save();

        return res.status(200).json(roadmap);
    } catch (error) {
        console.error('Error updating topic resources:', error);
        return res.status(500).json({ message: 'Failed to update topic resources' });
    }
};

module.exports = {
    generatePersonalizedRoadmap,
    markTopicComplete,
    followRoadmap,
    getRoadmap,
    getRoadmapProgress,
    getAllRoadmaps,
    updateTopicResources
};
