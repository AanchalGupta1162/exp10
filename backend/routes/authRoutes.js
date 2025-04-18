const express = require('express');
const router = express.Router();
const { register, login, checkAuth, logout, ping } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', checkAuth);
router.post('/logout', logout);
router.get('/ping', ping);

module.exports = router;