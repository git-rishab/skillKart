const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmap.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/follow', authenticate, roadmapController.followRoadmap);
router.post('/generate', roadmapController.generatePersonalizedRoadmap);
router.post('/marktopic/complete', authenticate, roadmapController.markTopicComplete);

module.exports = router;