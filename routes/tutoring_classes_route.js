const express = require("express");
const {body, validationResult} = require('express-validator');
const {formatErrorMessage, authenticateToken, checkAuthorized} = require ('./utils');
const {getUserByEmail} = require("../database/users");
const {getReviews, getOneReview} = require("../database/reviews");
const {getTutoringClass, getOneTutoringClass} = require("../database/tutoring_class");

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
    const result = await getTutoringClass();
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
