const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', authMiddleware, userController.userDetail);

// Add new endpoint for XP and streak data
router.get('/xp-data', authMiddleware, userController.getUserXpData);

module.exports = router;