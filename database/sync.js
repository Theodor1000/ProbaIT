const {ContactRequest} = require("./contact_requests");
const {User} = require("./users");
const {Review} = require("./reviews");
const {TutoringClass} = require("./tutoring_class");
const {Enrolment} = require("./enrolment");

async function sync() {
    await ContactRequest.sync();
    await User.sync();
    await Review.sync();
    await TutoringClass.sync();
    await Enrolment.sync();
}

module.exports = {sync};
