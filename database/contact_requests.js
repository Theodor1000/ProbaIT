const {DataTypes} = require('sequelize');

const CONTACT_REQUESTS_TABLE = 'contact_requests';

async function initializeContactRequestsTable(queryInterface) {
    await queryInterface.createTable(CONTACT_REQUESTS_TABLE, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(5001),
            allowNull: false,
        },
        is_resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
}

module.exports = {initializeContactRequestsTable};
