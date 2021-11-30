const express = require('express');
const {getContactRequests, addContactRequest} = require('../database/contact_requests');

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await getContactRequests();
    res.status(200).send(result);
});

router.post('/', async (req, res) => {
    await addContactRequest(req.body);
    res.status(200);
});

module.exports = router;
