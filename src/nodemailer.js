const nodemailer = require('nodemailer');
module.exports.sendMail = async function sendMail(str, data) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'upanshusharma0@gmail.com', 
            pass: 'ihcbsmmlwqgnqrxc', 
        },
    });

    var Osubject, Otext, Ohtml;
    if(str==='signup'){
        Osubject=`Thank you for signing ${data.name}`;
        Ohtml=`
        <h1>Welcome to Seatz</h1>
        Hope you have a good time !
        Here are your details-
        Name: ${data.firstName} ${data.lastName} <br>
        Password: ${data.password}<br>
        Email: ${data.email}<br>
        Phone number: ${data.mobileNumber}
        `
    }

    let info = await transporter.sendMail({
        from: '"Seatz 👻" <upanshusharma0@gmail.com>',
        to: data.email, 
        subject: Osubject, 
        // text: "Hello world?", // plain text body
        html: Ohtml, 
    });
    console.log("Message sent: %s", info.messageId); 
}