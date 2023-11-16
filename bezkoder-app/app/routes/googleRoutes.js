const express = require('express');
const googleAuthController = require('../controllers/googleController');
const router = express.Router();

router.use('/auth/google', googleAuthController);

module.exports = router;
