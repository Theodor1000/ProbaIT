const {DataTypes, Model} = require('sequelize');
const {TutoringClass} = require("./tutoring_class");
const {User} = require("./users");

class Enrolment extends Model {}

async function initializeEnrolmentTable(sequelize) {
    Enrolment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tutoring_class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Enrolment',
        timestamps: false,
    });

    Enrolment.belongsTo(TutoringClass, {foreignKey: 'tutoring_class_id', onDelete: 'cascade', hooks: true});
    TutoringClass.hasMany(Enrolment, {foreignKey: 'tutoring_class_id', onDelete: 'cascade', hooks: true});

    Enrolment.belongsTo(User, {foreignKey: 'student_id', onDelete: 'cascade', hooks: true});
    User.hasMany(Enrolment, {foreignKey: 'student_id', onDelete: 'cascade', hooks: true});
}

module.exports = {Enrolment, initializeEnrolmentTable};
