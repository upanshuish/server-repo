const nodemailer = require('nodemailer');
module.exports.sendMail = async function sendMail(str, data) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'rideseatz@gmail.com', 
            pass: 'klrdahqlzbcwzrwq', 
        },
    });

    var Osubject, Otext, Ohtml;
    if(str==='signup'){
        Osubject=`Thank you for signing ${data.firstName}`;
        Ohtml=`
        <h1>Welcome to Seatz</h1>
        Hope you have a good time !
        Here are your details-
        Email: ${data.email}<br>
        Password: ${data.password}
        `
    }

    let info = await transporter.sendMail({
        from: '"Seatz ðŸ‘ »<rideseatz@gmail.com>',
        to: data.email, 
        subject: Osubject, 
        // text: "Hello world?", // plain text body
        html: Ohtml, 
    });
    console.log("Message sent: %s", info.messageId); 
}
