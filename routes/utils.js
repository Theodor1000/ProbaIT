const jwt = require('jsonwebtoken');
const {getOneUser} = require("../database/users");

function formatErrorMessage(errors) {
    return errors.array().reduce((soFar, error) => soFar.concat(error.msg + '\n'), '');
}

function generateAccessToken(email) {
    return jwt.sign(email, TOKEN_SECRET, { expiresIn: '1000s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).send('authentication required');
        return;
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(403).send('authentication failed');
        }

        req.user = user;

        next();
    });
}

async function checkAuthorized(email, id) {
    const user = await getOneUser(id);
    if (user === undefined) {
        return 'not_found';
    }
    const userData = JSON.parse(user);
    if (userData.email !== email) {
        return 'forbidden';
    }
    return 'ok';
}

const TOKEN_SECRET = '6e1e24c3b69b47a04648412f6137a7ee3716e4250e0a75713faa80603cd49cdb4c42b6061dc98ac4a37f73daea94bd9741770716cb4a89bfc6fd847ee7dce075';
const SALT_ROUNDS = 10;

module.exports = {formatErrorMessage, generateAccessToken, authenticateToken, checkAuthorized, TOKEN_SECRET, SALT_ROUNDS};
