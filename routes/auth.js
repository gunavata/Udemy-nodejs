const express = require('express');
const {
    check,
    body
} = require('express-validator/check');

const authController = require('../controllers/auth.js')
const User = require('../models/user')

const router = express.Router();

router.get('/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address!')
        .normalizeEmail(),
        body('password', 'Password has to be valid!')
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim()
    ], authController.getLogin);

router.post('/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
        body('password', 'Password has to be valid.')
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim()
    ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {
            req
        }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email is forbidden')
            // }
            // return true;
            return User.findOne({
                    email: value
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already exists');
                    }
                })
        })
        .normalizeEmail(),
        body('password', 'Password must contain at least 5 characters and contain both letters and numbers')
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Password do not match!')
            }
            return true;
        })
    ],
    authController.postSignup);

router.get('/reset/:token', authController.getNewPassword);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;