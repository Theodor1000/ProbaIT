const express = require('express');
const {Sequelize} = require('sequelize');
const {initializeContactRequestsTable} = require('./database/contact_requests');
const contactRequestsRouter = require('./routes/conact_requests_route');
const bodyParser = require('body-parser');

const sequelizeForDatabaseCreation = new Sequelize('', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const databaseName = 'meditatii';
let sequelize;

(async () => {
    try {
        await sequelizeForDatabaseCreation
            .query(`CREATE DATABASE IF NOT EXISTS ${databaseName};`);
        await sequelizeForDatabaseCreation.authenticate();
        await sequelizeForDatabaseCreation.close();
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }

    sequelize = new Sequelize(databaseName, 'root', 'root', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    });

    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully!');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }

    try {
        await initializeContactRequestsTable(sequelize);
    } catch (error) {
        console.error('Table initialization failed: ', error);
    }
})();

const app = express();
const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});

app.use(bodyParser.json());
app.use('/contact-requests', contactRequestsRouter);

module.exports = {sequelize};
