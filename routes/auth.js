const express = require('express');

const authController = require('../controllers/auth.js')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/reset/:token', authController.getNewPassword);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;