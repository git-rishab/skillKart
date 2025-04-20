const mongoose = require('mongoose');
const DiscussionThread = require('../models/DiscussionThread.model');
const User = require('../models/User.model');

// Get all discussion threads
exports.getAllThreads = async (req, res) => {
    try {
        const threads = await DiscussionThread.find()
            .populate('createdBy', 'name email')
            .populate('replies.userId', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching discussion threads:', error);
        return res.status(500).json({ message: 'Failed to fetch discussion threads' });
    }
};

// Get threads by roadmap ID
exports.getThreadsByRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;

        const threads = await DiscussionThread.find({ roadmapId })
            .populate('createdBy', 'name email')
            .populate('replies.userId', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching roadmap discussion threads:', error);
        return res.status(500).json({ message: 'Failed to fetch discussion threads' });
    }
};

// Get a single thread by ID
exports.getThreadById = async (req, res) => {
    try {
        const { threadId } = req.params;

        const thread = await DiscussionThread.findById(threadId)
            .populate('createdBy', 'name email')
            .populate('replies.userId', 'name email');

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        return res.status(200).json(thread);
    } catch (error) {
        console.error('Error fetching thread details:', error);
        return res.status(500).json({ message: 'Failed to fetch thread details' });
    }
};

// Create a new discussion thread
exports.createThread = async (req, res) => {
    try {
        const { roadmapId, weekNumber, question } = req.body;
        const userId = req.user.id;

        const newThread = new DiscussionThread({
            roadmapId,
            weekNumber,
            createdBy: userId,
            question,
            replies: []
        });

        await newThread.save();

        // Populate user information before returning
        const populatedThread = await DiscussionThread.findById(newThread._id)
            .populate('createdBy', 'name email');

        return res.status(201).json(populatedThread);
    } catch (error) {
        console.error('Error creating discussion thread:', error);
        return res.status(500).json({ message: 'Failed to create discussion thread' });
    }
};

// Add a reply to a thread
exports.addReply = async (req, res) => {
    try {
        const { threadId } = req.params;
        const { answer } = req.body;
        const userId = req.user.id;

        const thread = await DiscussionThread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        thread.replies.push({
            userId,
            answer,
            createdAt: new Date()
        });

        await thread.save();

        // Populate user information before returning
        const populatedThread = await DiscussionThread.findById(threadId)
            .populate('createdBy', 'name email')
            .populate('replies.userId', 'name email');

        return res.status(200).json(populatedThread);
    } catch (error) {
        console.error('Error adding reply:', error);
        return res.status(500).json({ message: 'Failed to add reply' });
    }
};

// Delete a thread (only by creator or admin)
exports.deleteThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const thread = await DiscussionThread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        // Check if user is the creator or an admin
        if (thread.createdBy.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this thread' });
        }

        await DiscussionThread.findByIdAndDelete(threadId);

        return res.status(200).json({ message: 'Thread deleted successfully' });
    } catch (error) {
        console.error('Error deleting thread:', error);
        return res.status(500).json({ message: 'Failed to delete thread' });
    }
};

// Delete a reply (only by reply creator or admin)
exports.deleteReply = async (req, res) => {
    try {
        const { threadId, replyId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const thread = await DiscussionThread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        const replyIndex = thread.replies.findIndex(reply => reply._id.toString() === replyId);

        if (replyIndex === -1) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if user is the reply creator or an admin
        if (thread.replies[replyIndex].userId.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this reply' });
        }

        thread.replies.splice(replyIndex, 1);
        await thread.save();

        // Populate user information before returning
        const populatedThread = await DiscussionThread.findById(threadId)
            .populate('createdBy', 'name email')
            .populate('replies.userId', 'name email');

        return res.status(200).json(populatedThread);
    } catch (error) {
        console.error('Error deleting reply:', error);
        return res.status(500).json({ message: 'Failed to delete reply' });
    }
};