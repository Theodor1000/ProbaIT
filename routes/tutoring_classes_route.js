const express = require("express");
const {body, validationResult} = require('express-validator');
const {formatErrorMessage, authenticateToken, checkAuthorized} = require ('./utils');
const {getUserByEmail} = require("../database/users");
const {getTutoringClass, getOneTutoringClass, addTutoringClass, updateTutoringClass, deleteTutoringClass} = require("../database/tutoring_class");

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getTutoringClass(req.query.subject);
    res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
    const result = await getOneTutoringClass(req.params.id);
    if (result === undefined) {
        res.status(404).send('id not found');
        return;
    }
    res.status(200).send(result);
});

router.post(
    '/',
    authenticateToken,
    body('description')
        .exists().withMessage('description must be provided')
        .bail()
        .isString().withMessage('description must be a string')
        .bail()
        .isLength({min: 1, max: 500}).withMessage('description must be between 1 and 500 characters long'),
    body('subject')
        .exists().withMessage('subject must be provided')
        .bail()
        .isString().withMessage('subject must be a string')
        .bail()
        .isLength({min: 1, max: 80}).withMessage('subject must be between 1 and 80 characters long'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const user = await getUserByEmail(req.user.email);
        if (user === undefined) {
            res.status(404).send('user not found');
            return;
        }

        if (user.role !== 'teacher') {
            res.status(403).send('only teachers can access this endpoint');
            return;
        }

        const userId = user.id;

        const result = await addTutoringClass(req.body.description, req.body.subject, userId);
        res.status(200).send(result);
    });

router.patch(
    '/:id',
    authenticateToken,
    body('description')
        .exists().withMessage('description must be provided')
        .bail()
        .isString().withMessage('description must be a string')
        .bail()
        .isLength({min: 1, max: 500}).withMessage('description must be between 1 and 500 characters long'),
    async (req, res) => {
        const tutoringClass = await getOneTutoringClass(req.params.id);
        if (tutoringClass === undefined) {
            res.status(404).send('id not found');
            return;
        }
        const status = await checkAuthorized(req.user.email, JSON.parse(tutoringClass).teacher_id);

        if (status === 'forbidden') {
            res.status(403).send('you are not authorized to make changes to other users');
            return;
        }
        if (status === 'not_found') {
            res.status(404).send('user not found');
            return;
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const result = await updateTutoringClass(req.params.id, req.body.description);

        if (result === undefined) {
            res.status(404).send('id not found');
            return;
        }

        res.status(200).send('Success!');
    });

router.delete(
    '/:id',
    authenticateToken,
    async (req, res) => {
        const tutoringClass = await getOneTutoringClass(req.params.id);
        if (tutoringClass === undefined) {
            res.status(404).send('id not found');
            return;
        }
        const status = await checkAuthorized(req.user.email, JSON.parse(tutoringClass).teacher_id);

        if (status === 'forbidden') {
            res.status(403).send('you are not authorized to make changes to other users');
            return;
        }
        if (status === 'not_found') {
            res.status(404).send('user not found');
            return;
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const result = await deleteTutoringClass(req.params.id);

        if (result === undefined) {
            res.status(404).send('id not found');
            return;
        }

        res.status(200).send('Success!');
    });

module.exports = router;
