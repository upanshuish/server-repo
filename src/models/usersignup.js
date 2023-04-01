const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: Number, required: true, unique:true },
    emailToken: { type: String},
    isVerified: { type: Boolean}
})

const SignedUp = mongoose.model('SignedUp', signupSchema);
module.exports = SignedUp;