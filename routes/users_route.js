const express = require('express');
const {body, validationResult} = require('express-validator');
const {formatErrorMessage} = require ('./utils');
const {getUsers, getOneUser} = require("../database/users");

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getUsers();
    res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
    const result = await getOneUser(req.params.id);
    if (result === undefined) {
        res.status(404).send('id not found');
        return;
    }
    res.status(200).send(result);
});

module.exports = router;
