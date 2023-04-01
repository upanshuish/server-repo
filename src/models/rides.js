const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    seats: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    vehicletype: { type: String, required: true },
    price: { type: Number, required: true },
    contact: { type: Number, required: true}
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;