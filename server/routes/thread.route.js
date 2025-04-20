const express = require('express');
const router = express.Router();
const threadController = require('../controllers/thread.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all discussion threads
router.get('/', threadController.getAllThreads);

// Get threads by roadmap ID
router.get('/roadmap/:roadmapId', threadController.getThreadsByRoadmap);

// Get thread by ID
router.get('/:threadId', threadController.getThreadById);

// Create a new thread (requires auth)
router.post('/', authMiddleware, threadController.createThread);

// Add reply to a thread (requires auth)
router.post('/:threadId/reply', authMiddleware, threadController.addReply);

// Delete a thread (requires auth)
router.delete('/:threadId', authMiddleware, threadController.deleteThread);

// Delete a reply (requires auth)
router.delete('/:threadId/reply/:replyId', authMiddleware, threadController.deleteReply);

module.exports = router;