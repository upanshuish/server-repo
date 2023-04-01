const mongoose = require('mongoose');

const forgotSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
})

const ResetPassword = mongoose.model('ResetPassword', forgotSchema);
module.exports = ResetPassword;