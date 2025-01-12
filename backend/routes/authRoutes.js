const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticate = require('../middleware/jwt/authenticate');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/user-details', authenticate, authController.getUserDetails);

module.exports = router;
