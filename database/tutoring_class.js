const {DataTypes, Model} = require('sequelize');
const {User} = require("./users");

class TutoringClass extends Model {}

async function initializeTutoringClassTable(sequelize) {
    TutoringClass.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(501),
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING(81),
            allowNull: false,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'TutoringClasses',
        timestamps: false,
    });

    TutoringClass.belongsTo(User, {foreignKey: 'teacher_id', onDelete: 'cascade', hooks: true});
    User.hasMany(TutoringClass, {foreignKey: 'teacher_id', onDelete: 'cascade', hooks: true});
}

async function getTutoringClass(subject) {
    let result;
    if (subject === undefined) {
        result = await TutoringClass.findAll();
    } else {
        result = await TutoringClass.findAll({where: {subject}});
    }
    return JSON.stringify(result, null, 2);
}

async function getOneTutoringClass(id) {
    const result = await TutoringClass.findAll({where: {id}});
    if (result.length === 0) {
        return undefined;
    }

    return JSON.stringify(result[0], null, 2);
}

async function addTutoringClass(description, subject, userId) {
    const result = await TutoringClass.create({
        description,
        subject,
        teacher_id: userId,
    });
    return JSON.stringify(result, null, 2);
}

async function updateTutoringClass(id, description) {
    const exists = getOneTutoringClass(id);
    if (exists === undefined) {
        return undefined;
    }

    const result = await TutoringClass.update({description}, {where: {id}});
    return JSON.stringify(result, null, 2);
}

async function deleteTutoringClass(id) {
    const exists = getOneTutoringClass(id);
    if (exists === undefined) {
        return undefined;
    }

    const result = await TutoringClass.destroy({where: {id}});
    return JSON.stringify(result, null, 2);
}

module.exports = {deleteTutoringClass, updateTutoringClass, initializeTutoringClassTable, TutoringClass, getOneTutoringClass, getTutoringClass, addTutoringClass};
