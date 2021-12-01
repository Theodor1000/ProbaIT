const express = require("express");
const {body, validationResult} = require('express-validator');
const {formatErrorMessage, authenticateToken, checkAuthorized} = require ('./utils');
const {getUserByEmail} = require("../database/users");
const {getReviews, getOneReview, addReview, updateReview, deleteReview} = require("../database/reviews");

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getReviews();
    res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
    const result = await getOneReview(req.params.id);
    if (result === undefined) {
        res.status(404).send('id not found');
        return;
    }
    res.status(200).send(result);
});

router.post(
    '/',
    authenticateToken,
    body('message')
        .exists().withMessage('message must be provided')
        .bail()
        .isString().withMessage('message must be a string')
        .bail()
        .isLength({min: 1, max: 500}).withMessage('message must be between 1 and 500 characters long'),
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
        const userId = user.id;

        const result = await addReview(req.body.message, userId);
        res.status(200).send(result);
    });

router.patch(
    '/:id',
    authenticateToken,
    body('message')
        .exists().withMessage('message must be provided')
        .bail()
        .isString().withMessage('message must be a string')
        .bail()
        .isLength({min: 1, max: 500}).withMessage('message must be between 1 and 500 characters long'),
    async (req, res) => {
        const review = await getOneReview(req.params.id);
        if (review === undefined) {
            res.status(404).send('id not found');
            return;
        }
        const status = await checkAuthorized(req.user.email, JSON.parse(review).user_id);

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

        const result = await updateReview(req.params.id, req.body.message);

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
        const review = await getOneReview(req.params.id);
        if (review === undefined) {
            res.status(404).send('id not found');
            return;
        }
        const status = await checkAuthorized(req.user.email, JSON.parse(review).user_id);

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

        const result = await deleteReview(req.params.id);

        if (result === undefined) {
            res.status(404).send('id not found');
            return;
        }

        res.status(200).send('Success!');
    });

module.exports = router;
