const {DataTypes, Model} = require('sequelize');

class ContactRequest extends Model {}

async function initializeContactRequestsTable(sequelize) {
    ContactRequest.init({
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
    }, {
        sequelize,
        modelName: 'ContactRequest',
    });
    await ContactRequest.sync();
}

async function getContactRequests() {
    const contactRequests = await ContactRequest.findAll();
    return JSON.stringify(contactRequests, null, 2);
}
async function addContactRequest(params) {
    await ContactRequest.create({
        name: params.name,
        email: params.email,
        message: params.message
    });
}

module.exports = {initializeContactRequestsTable, getContactRequests, addContactRequest};
