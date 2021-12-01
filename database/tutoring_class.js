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

async function getTutoringClass() {
    const result = await TutoringClass.findAll();
    return JSON.stringify(result, null, 2);
}

async function getOneTutoringClass(id) {
    const result = await TutoringClass.findAll({where: {id}});
    if (result.length === 0) {
        return undefined;
    }

    return JSON.stringify(result[0], null, 2);
}

module.exports = {initializeTutoringClassTable, TutoringClass, getOneTutoringClass, getTutoringClass};
