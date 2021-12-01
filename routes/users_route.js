const express = require('express');
const {body, validationResult, oneOf} = require('express-validator');
const {formatErrorMessage, authenticateToken, checkAuthorized, SALT_ROUNDS} = require ('./utils');
const {getUsers, getOneUser, deleteUser, updateUser} = require("../database/users");
const bcrypt = require("bcrypt");

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

router.patch(
    '/:id',
    authenticateToken,
    oneOf(
        [
            body('email').exists(),
            body('firstname').exists(),
            body('lastname').exists(),
            body('password').exists(),
        ],
        'at least one of: email, firstname, lastname, password must be provided',
    ),
    body('email')
        .optional()
        .isEmail().withMessage('email is not valid')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('email must be between 1 and 50 characters long')
        .bail()
        .custom((value) => value.match(/(@stud\.upb\.ro|@onmicrosoft\.upb\.ro)$/))
        .withMessage('email must end in @stud.upb.ro or @onmicrosoft.upb.ro'),
    body('firstname')
        .optional()
        .isString().withMessage('firstname must be a string')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('firstname must be between 1 and 50 characters long'),
    body('lastname')
        .optional()
        .isString().withMessage('lastname must be a string')
        .bail()
        .isLength({min: 1, max: 50}).withMessage('lastname must be between 1 and 50 characters long'),
    body('password')
        .optional()
        .isString().withMessage('password must be a string')
        .bail()
        .isLength({min: 8, max: 50}).withMessage('password must be between 8 and 50 characters long')
        .custom((value, {req}) => req.body.confirmation_password !== undefined)
        .withMessage('if password is provided, confirmation_password must be provided, too'),
    body('confirmation_password')
        .optional()
        .isString().withMessage('confirmation_password must be a string')
        .bail()
        .custom((value, {req}) => value === req.body.password)
        .withMessage('confirmation_password must match the password'),
    async (req, res) => {
        const status = await checkAuthorized(req.user.email, req.params.id);

        if (status === 'forbidden') {
            res.status(403).send('you are not authorized to make changes to other users');
            return;
        }
        if (status === 'not_found') {
            res.status(404).send('id not found');
            return;
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(formatErrorMessage(errors));
            return;
        }

        const body = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            email: req.body.email,
        };

        if (body.firstname === undefined) {
            delete body.firstname;
        }
        if (body.lastname === undefined) {
            delete body.lastname;
        }
        if (body.email === undefined) {
            delete body.email;
        }

        if (body.password === undefined) {
            delete body.password;

            const result = await updateUser(req.params.id, body);
            if (result === undefined) {
                res.status(404).send('id not found');
                return;
            }
            res.status(200).send('Success!');
        } else {
            await bcrypt.hash(body.password, SALT_ROUNDS, async function(err, hash) {
                body.password = hash;

                const result = await updateUser(req.params.id, body);
                if (result === undefined) {
                    res.status(404).send('id not found');
                    return;
                }
                res.status(200).send('Success!');
            });
        }
    });

router.delete('/:id', authenticateToken, async (req, res) => {
    const status = await checkAuthorized(req.user.email, req.params.id);

    if (status === 'forbidden') {
        res.status(403).send('you are not authorized to make changes to other users');
        return;
    }
    if (status === 'not_found') {
        res.status(404).send('id not found');
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
