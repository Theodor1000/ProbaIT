const express = require('express');
const {body, validationResult} = require('express-validator');
const {formatErrorMessage, generateAccessToken, SALT_ROUNDS} = require ('./utils');
const {registerUser, loginUser} = require('../database/users');
const bcrypt = require ('bcrypt');

const router = express.Router();

router.post(
    '/register',
    body('email')
        .exists().withMessage('email must be provided')
        .bail()
        .isEmail().withMessage('email is not valid')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('email must be between 1 and 50 characters long')
        .bail()
        .custom((value) => value.match(/(@stud\.upb\.ro|@onmicrosoft\.upb\.ro)$/))
        .withMessage('email must end in @stud.upb.ro or @onmicrosoft.upb.ro'),
    body('firstname')
        .exists().withMessage('firstname must be provided')
        .bail()
        .isString().withMessage('firstname must be a string')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('firstname must be between 1 and 50 characters long'),
    body('lastname')
        .exists().withMessage('lastname must be provided')
        .bail()
        .isString().withMessage('lastname must be a string')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('lastname must be between 1 and 50 characters long'),
    body('password')
        .exists().withMessage('password must be provided')
        .bail()
        .isString().withMessage('password must be a string')
        .bail()
        .isLength({min: 8, max: 50}).withMessage('password must be between 8 and 50 characters long'),
    body('confirmation_password')
        .exists().withMessage('confirmation_password must be provided')
        .bail()
        .isString().withMessage('confirmation_password must be a string')
        .bail()
        .custom((value, {req}) => value === req.body.password)
        .withMessage('confirmation_password must match the password'),
    body('role')
        .exists().withMessage('role must be provided')
        .bail()
        .isString().withMessage('role must be a string')
        .bail()
        .isIn(['teacher', 'student']).withMessage('role must be either teacher or student')
        .bail()
        .custom((value, {req}) =>
            (req.body.email.match(/@stud\.upb\.ro$/) && value === 'student') ||
            (req.body.email.match(/@onmicrosoft\.upb\.ro$/) && value === 'teacher'))
        .withMessage('email domain does not match the role'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const body = req.body;
        await bcrypt.hash(body.password, SALT_ROUNDS, async function(err, hash) {
            body.password = hash;

            const result = await registerUser(body);
            if (result === undefined) {
                res.status(409).send('an account with the same email address is already registered');
                return;
            }

            res.status(200).send(result);
        });
    });

router.post(
    '/login',
    body('email')
        .exists().withMessage('email must be provided')
        .bail()
        .isEmail().withMessage('email is not valid')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('email must be between 1 and 50 characters long')
        .bail()
        .custom((value) => value.match(/(@stud\.upb\.ro|@onmicrosoft\.upb\.ro)$/))
        .withMessage('email must end in @stud.upb.ro or @onmicrosoft.upb.ro'),
    body('password')
        .exists().withMessage('password must be provided')
        .bail()
        .isString().withMessage('password must be a string')
        .bail()
        .isLength({min: 8, max: 50}).withMessage('password must be between 8 and 50 characters long'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const errorMessage = 'this combination of email and password is not existing';
        const result = await loginUser(req.body.email);

        if (result === undefined) {
            res.status(401).send(errorMessage);
            return;
        }

        await bcrypt.compare(req.body.password, result.dataValues.password, async function(err, comparisonResult) {
            if (comparisonResult) {
                const token = generateAccessToken({email: req.body.email});
                res.status(200).send(token);
            } else {
                res.status(401).send(errorMessage);
            }
        });
    });

module.exports = router;
