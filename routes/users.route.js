const express = require('express');
const {registeredUser, loginUser, getUserPreferences, updateUserPreferences}= require('../controllers/users.controller')
const authenticateToken = require('../middleware/auth')
const router= express.Router()

router.post('/signup', registeredUser)
router.post('/login', loginUser)

router.get('/preferences', authenticateToken, getUserPreferences);
router.put('/preferences', authenticateToken, updateUserPreferences);


module.exports= router