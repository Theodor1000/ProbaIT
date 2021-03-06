const express = require('express');
const {body, validationResult} = require('express-validator');
const {formatErrorMessage} = require ('./utils');
const {getContactRequests, addContactRequest, getOneContactRequest, updateContactRequest, deleteContactRequest} = require('../database/contact_requests');

const router = express.Router();

router.get('/', async (req, res) => {
    const sortBy = req.query.sortBy;
    const order = req.query.order;
    const filterBy = req.query.filterBy;

    if ((sortBy === undefined && order !== undefined) || (sortBy !== undefined && order === undefined)) {
        res.status(400).send('Both sortBy and order must be provided!');
        return;
    }
    if (sortBy !== undefined && sortBy !== 'id' && sortBy !== 'name' && sortBy !== 'email' && sortBy !== 'message') {
        res.status(400).send('sortBy must be one of: name, email or message');
        return;
    }
    if (order !== undefined && order !== 'ASC' && order !== 'DESC') {
        res.status(400).send('order must be one of: ASC or DESC');
        return;
    }

    let filter = undefined;
    if (filterBy !== undefined) {
        try {
            filter = JSON.parse(filterBy);
        } catch (error) {
            res.status(400).send('filterBy must be a JSON')
            return;
        }
        const properties = Object.getOwnPropertyNames(filter);

        if (!properties.every(elem => ['id', 'name', 'email', 'message', 'is_resolved'].includes(elem))) {
            res.status(400).send('filterBy must only contain: name, email, id, is_resolved, message');
            return;
        }
    }

    const result = await getContactRequests(sortBy, order, filter);
    res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
    const result = await getOneContactRequest(req.params.id);
    if (result === undefined) {
        res.status(404).send('id not found');
        return;
    }
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

        const result = await addContactRequest(req.body);
        res.status(200).send(result);
});

router.patch(
    '/:id',
    body('is_resolved')
        .exists().withMessage('is_resolved must be provided')
        .bail()
        .isBoolean().withMessage('is_resolved must be a boolean'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }
        // 0 and 1 are accepted by the validator, so they are eliminated manually
        if (req.body.is_resolved === 0 || req.body.is_resolved === 1) {
            res.status(400).send('is_resolved must be a boolean');
        }

        const result = await updateContactRequest(req.params.id, req.body.is_resolved);

        if (result === undefined) {
            res.status(404).send('id not found');
            return;
        }

        res.status(200).send('Success!');
    });

router.delete(
    '/:id',
    async (req, res) => {
        const result = await deleteContactRequest(req.params.id);

        if (result === undefined) {
            res.status(404).send('id not found');
            return;
        }

        res.status(200).send('Success!');
    });

module.exports = router;
