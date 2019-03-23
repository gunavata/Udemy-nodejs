const express = require('express');
const {check, body} = require('express-validator/check');

const authController = require('../controllers/auth.js')
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

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
            User
        .findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists')
                return res.redirect('/signup')
            } else {
                return bcrypt
            })
        )
            // if (value === 'test@test.com') {
            //     throw new Error('This email is forbidden')
            // }
            // return true;
        ,
        body('password', 'Email must contain at least 5 characters and contain both letters and numbers')
        .isLength({
            min: 5
        })
        .isAlphanumeric(),
        body('confirmPassword')
        .custom((value, { req } ) => {
            if (value !== req.body.password) {
                throw new Error('Password do not match!')
            }
            return true;
        })
    ] ,
    authController.postSignup);

router.get('/reset/:token', authController.getNewPassword);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;