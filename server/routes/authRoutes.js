const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser } = require('../controllers/authController');
// const { getAppPage } = require('../controllers/userController');
const { loginUser } = require('../controllers/loginUser')



// router.get('/app', authMiddleware, getAppPage);

router.post('/login', loginUser)

router.post('/register', registerUser);

module.exports = router;
