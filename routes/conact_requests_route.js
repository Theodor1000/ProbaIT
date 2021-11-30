const express = require('express');
const {body, validationResult} = require('express-validator');
const {getContactRequests, addContactRequest} = require('../database/contact_requests');

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getContactRequests();
    res.status(200).send(result);
});

router.post(
    '/',
    body('name')
        .exists().withMessage('name must be provided')
        .bail()
        .isString().withMessage('name must be a string')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('name must be between 1 and 50 characters long'),
    body('email')
        .exists().withMessage('email must be provided')
        .bail()
        .isEmail().withMessage('email is not valid')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('email must be between 1 and 50 characters long'),
    body('message')
        .exists().withMessage('message must be provided')
        .bail()
        .isString().withMessage('message must be a string')
        .bail()
        .isLength({min: 1, max: 5000}).withMessage('message must be between 1 and 5000 characters long'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        await addContactRequest(req.body);
        res.status(200).send();
});

function formatErrorMessage(errors) {
    return errors.array().reduce((soFar, error) => soFar.concat(error.msg + '\n'), '');
}

module.exports = router;
