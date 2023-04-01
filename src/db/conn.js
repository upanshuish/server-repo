const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:wSD6ln9CCGn1Rfoo@iupanshu.myqtkdk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database', err);
    });