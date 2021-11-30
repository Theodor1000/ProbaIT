const {DataTypes, Model} = require('sequelize');

class User extends Model {}

async function initializeUsersTable(sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: false,
    });
    await User.sync();
}

async function registerUser(params) {
    let result;

    try {
        result = await User.create({
            firstname: params.firstname,
            lastname: params.lastname,
            email: params.email,
            password: params.password,
            role: params.role,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            result = undefined;
        }
    }

    if (result === undefined) {
        return undefined;
    }
    delete result.dataValues.password;
    return JSON.stringify(result, null, 2);
}

async function loginUser(email) {
    const result = await User.findAll({where: {email}});
    if (result.length === 0) {
        return undefined;
    }
    return result[0];
}

module.exports = {initializeUsersTable, registerUser, loginUser};
