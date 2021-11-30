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
        timestamps: false,
    });
    await ContactRequest.sync();
}

async function getContactRequests(sortBy, order) {
    let contactRequests;
    if (sortBy === undefined || order === undefined) {
        contactRequests = await ContactRequest.findAll();
    } else {
        contactRequests = await ContactRequest.findAll({order: [[sortBy, order]]});
    }
    return JSON.stringify(contactRequests, null, 2);
}

async function getOneContactRequest(id) {
    const contactRequests = await ContactRequest.findAll({where: {id}});
    if (contactRequests.length === 0) {
        return undefined;
    }
    return JSON.stringify(contactRequests, null, 2);
}

async function addContactRequest(params) {
    const result = await ContactRequest.create({
        name: params.name,
        email: params.email,
        message: params.message
    });
    return JSON.stringify(result, null, 2);
}

async function updateContactRequest(id, is_resolved) {
    const exists = await getOneContactRequest(id);
    if (exists === undefined) {
        return undefined;
    }
    const result = await ContactRequest.update({is_resolved}, {where: {id}});
    return JSON.stringify(result, null, 2);
}

async function deleteContactRequest(id) {
    const exists = await getOneContactRequest(id);
    if (exists === undefined) {
        return undefined;
    }
    const result = await ContactRequest.destroy({where: {id}});
    return JSON.stringify(result, null, 2);
}

module.exports = {initializeContactRequestsTable, getContactRequests, addContactRequest, getOneContactRequest, updateContactRequest, deleteContactRequest};
