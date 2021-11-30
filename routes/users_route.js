const express = require('express');
const {body, validationResult} = require('express-validator');
const {formatErrorMessage, authenticateToken} = require ('./utils');
const {getUsers, getOneUser, deleteUser} = require("../database/users");

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

router.delete('/:id', authenticateToken, async (req, res) => {
    const user = await getOneUser(req.params.id);
    if (user === undefined) {
        res.status(404).send('id not found');
        return;
    }
    const userData = JSON.parse(user);
    if (userData.email !== req.user.email) {
        res.status(403).send('you are not authorized to make changes to other users');
        return;
    }

    const result = await deleteUser(req.params.id);
    if (result === undefined) {
        res.status(404).send('id not found');
        return;
    }
    res.status(200).send('Success!');
});

module.exports = router;
