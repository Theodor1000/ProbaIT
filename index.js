const express = require('express');
const {Sequelize} = require('sequelize');
const contactRequestsRouter = require('./routes/contact_requests_route');
const usersRouter = require('./routes/users_route');
const authRouter = require('./routes/auth_route');
const reviewsRouter = require('./routes/reviews_route');
const tutoringClassRouter = require('./routes/tutoring_classes_route');
const bodyParser = require('body-parser');
const {initializeContactRequestsTable} = require('./database/contact_requests');
const {initializeUsersTable} = require("./database/users");
const {initializeReviewsTable} = require("./database/reviews");
const {sync} = require("./database/sync");
const {initializeTutoringClassTable} = require("./database/tutoring_class");
const {initializeEnrolmentTable} = require("./database/enrolment");

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
        await initializeUsersTable(sequelize);
        await initializeReviewsTable(sequelize);
        await initializeTutoringClassTable(sequelize);
        await initializeEnrolmentTable(sequelize);
        await sync();
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
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/reviews', reviewsRouter);
app.use('/tutoring-classes', tutoringClassRouter);

module.exports = {sequelize};
