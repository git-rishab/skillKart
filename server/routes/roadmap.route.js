const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmap.controller');
const authenticate = require('../middlewares/auth.middleware');
const isRoleAllowed = require('../middlewares/role.middleware');

// Regular user routes
router.post('/follow', authenticate, roadmapController.followRoadmap);
router.get('/:roadmapId', authenticate, roadmapController.getRoadmap);
router.post('/generate', authenticate, roadmapController.generatePersonalizedRoadmap);
router.post('/marktopic/complete', authenticate, roadmapController.markTopicComplete);
router.get('/progress/:roadmapId', authenticate, roadmapController.getRoadmapProgress);

// Admin routes for managing roadmaps
router.put('/:roadmapId/module/:moduleIndex/topic/:topicIndex/resources',
    authenticate,
    isRoleAllowed(['admin']),
    roadmapController.updateTopicResources
);

router.get('/admin/all',
    authenticate,
    isRoleAllowed(['admin']),
    roadmapController.getAllRoadmaps
);

module.exports = router;