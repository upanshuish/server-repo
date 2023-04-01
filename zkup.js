const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://admin:wSD6ln9CCGn1Rfoo@iupanshu.myqtkdk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB database');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB database', err);
    });

// Define schema for ride data
const rideSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    seatsAvailable: Number,
    date: Date,
    time: String,
    vehicleType: String
});

// Define model for ride data
const Ride = mongoose.model('Ride', rideSchema);

// Define route to handle ride data submission
app.post('/publish', (req, res) => {
    console.log("hitted");
    const ride = new Ride({
        name: req.body.name,
        from: req.body.from,
        to: req.body.to,
        seatsAvailable: req.body.seatsAvailable,
        date: req.body.date,
        time: req.body.time,
        vehicleType: req.body.vehicleType
    });
    ride.save((err) => {
        if (err) {
            console.log('Error saving ride data', err);
            res.status(500).send('Error saving ride data');
        } else {
            console.log('Ride data saved successfully');
            res.status(200).send('Ride data saved successfully');
        }
    });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
