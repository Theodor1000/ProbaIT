const {DataTypes, Model} = require('sequelize');
const {User} = require("./users");

class Review extends Model {}

async function initializeReviewsTable(sequelize) {
    Review.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(501),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,

        }
    }, {
        sequelize,
        modelName: 'Review',
        timestamps: false,
    });
    await Review.sync();

    Review.belongsTo(User, {foreignKey: 'user_id'});
    User.hasMany(Review, {foreignKey: 'user_id'});
}

async function getReviews() {
    const result = await Review.findAll();
    return JSON.stringify(result, null, 2);
}

async function getOneReview(id) {
    const result = await Review.findAll({where: {id}});
    if (result.length === 0) {
        return undefined;
    }

    return JSON.stringify(result[0], null, 2);
}

async function addReview(message, userId) {
    const result = await Review.create({
        message,
        user_id: userId,
    });
    return JSON.stringify(result, null, 2);
}

async function updateReview(id, message) {
    const exists = getOneReview(id);
    if (exists === undefined) {
        return undefined;
    }

    const result = await Review.update({message}, {where: {id}});
    return JSON.stringify(result, null, 2);
}

async function deleteReview(id) {
    const exists = getOneReview(id);
    if (exists === undefined) {
        return undefined;
    }

    const result = await Review.destroy({where: {id}});
    return JSON.stringify(result, null, 2);
}

module.exports = {initializeReviewsTable, getOneReview, getReviews, addReview, updateReview, deleteReview};
