const express = require("express");
const {getUserByEmail} = require("../database/users");
const {addEnrolment, checkIfEntryExists} = require("../database/enrolment");
const {authenticateToken} = require("./utils");

const router = express.Router();

router.post('/:id/enroll', authenticateToken, async (req, res) => {
    const user = await getUserByEmail(req.user.email);
    if (user === undefined) {
        res.status(404).send('user not found');
        return;
    }

    if (user.role !== 'student') {
        res.status(403).send('only students can access this endpoint');
        return;
    }

    const userId = user.id;

    const exists = await checkIfEntryExists(userId, req.params.id);
    if (exists) {
        res.status(409).send('enrolment already done');
        return;
    }

    const result = await addEnrolment(userId, req.params.id);
    if (result === undefined) {
        res.status(400).send('id not found');
        return;
    }

    res.status(200).send(result);
});

module.exports = router;
