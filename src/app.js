const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const hbs = require('hbs');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const JWT_KEY = 'cwbdibvnvnuvwqtecfvxvwyfrytbg';
const protectRoute = require('./auth');
require('./db/conn');
const Ride = require("./models/rides")
const SignedUp = require("./models/usersignup")
// const Loggedin = require("./models/userlogin")
const ResetPassword = require("./models/forgot")
const { json } = require('express');
const {sendMail}=require('./nodemailer')

const handlebars = require('handlebars');
const dateFormat = require('handlebars-dateformat');

hbs.registerHelper('dateFormat', function (date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
});
handlebars.registerHelper('dateFormat', dateFormat);

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public')
const templates_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', templates_path);
hbs.registerPartials(partials_path);

app.get("/", protectRoute, (req, res) => {
    res.render("index");
})
app.get("/forgotpass", (req, res) => {
    res.render("forgotpass");
})
app.get("/index", protectRoute, (req, res) => {
    res.render("index");
})
app.get('/publish', protectRoute, (req, res) => {
    res.render('publish');
});
// app.get('/login', (req, res) => {
//     res.render('login');
// });
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/rideDetails', (req, res) => {
    const { rideId } = req.query;

    Ride.findById(rideId)
        .then((ride) => {
            res.render('rideDetails', { ride });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('An error occurred while fetching ride details.');
        });
});

app.get('/logout', (req, res) => {
    res.cookie('login', " ", { maxAge: 1 });
    res.render('login');
});

app.post('/forgotpass', async (req, res) => {
    try {
        const forgottenpass = new ResetPassword({
            email: req.body.email
        });
        const forgotten = await forgottenpass.save();
        res.status(201).render('login');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.post('/', async (req, res) => {
    try {
        const from = req.body.from.toLowerCase();
        const to = req.body.to.toLowerCase();
        const date = req.body.date;

        const rides = await Ride.find({
            from: { $regex: new RegExp(from, "i") },
            to: { $regex: new RegExp(to, "i") },
            date: date,
            seats: { $gt: 0 }
        }).lean();

        res.render('search', { rides: rides });
        // return res.send(rides);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.post('/publish', async (req, res) => {
    try {
        const ride = new Ride({
            name: req.body.name,
            from: req.body.from,
            to: req.body.to,
            bp: req.body.bp,
            dp: req.body.dp,
            seats: req.body.seats,
            date: req.body.date,
            time: req.body.time,
            vehicletype: req.body.vehicletype,
            price: req.body.price,
            contact: req.body.contact
        });
        const registered = await ride.save();
        res.status(201).render('index');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.post('/signup', async (req, res) => {
    try {
        const signedup = new SignedUp({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false
        });
        try {
            await sendMail('signup', signedup);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(signedup.password, salt);
            signedup.password = hashedPassword;
            const signed = await signedup.save();
            res.render('login');

        } catch (err) {
            if (err.code === 11000 && err.message.includes('email')) {
                console.log("User already signed in");
                res.render('login');
            } else {
                console.log(err);
                res.status(400).send(err);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const findUser = await SignedUp.findOne({ email: req.body.email });
        if (findUser) {
            const match = await bcrypt.compare(password, findUser.password);
            if (match) {
                let uid = findUser['_id'];
                let token = jwt.sign({ payload: uid }, JWT_KEY);
                console.log(token);
                res.cookie('login', token, { httpOnly: true });
                try {
                    // const logged = await loggedin.save();
                    console.log("User logged in");
                    res.render('index');
                } catch (err) {
                    if (err.code === 11000 && err.message.includes('email')) {
                        console.log("User already logged in");
                        res.render('index');
                    } else {
                        console.log(err);
                        res.status(400).send(err);
                    }
                }
            }
            else {
                res.send("wrong password");
            }
        } else {
            res.render("userNotFound");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.post('/bookings/:id', async (req, res) => {
    const rideId = req.params.id;
    try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).send('Ride not found');
        }
        if (ride.seats === 0) {
            await Ride.findByIdAndDelete(rideId);
            return res.status(400).send('No seats available');
        }
        ride.seats--;
        ride.markModified('seats');
        await ride.save();
        res.render('booked');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

