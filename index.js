const express = require('express');
const {Sequelize} = require('sequelize');
const {initializeContactRequestsTable} = require('./database/contact_requests');

const sequelizeForDatabaseCreation = new Sequelize('', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

const databaseName = 'meditatii';

(async () => {
    try {
        await sequelizeForDatabaseCreation
            .query(`CREATE DATABASE IF NOT EXISTS ${databaseName};`);
        await sequelizeForDatabaseCreation.authenticate();
        console.log('Database creation successful!');
        await sequelizeForDatabaseCreation.close();
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }

    const sequelize = new Sequelize(databaseName, 'root', 'root', {
        host: 'localhost',
        dialect: 'mysql',
    });
    const queryInterface = sequelize.getQueryInterface();

    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }

    try {
        await initializeContactRequestsTable(queryInterface);
    } catch (error) {
        console.error('Table initialization failed: ', error);
    }
})();

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
