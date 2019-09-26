var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agung040100@gmail.com',
        pass: 'agoeng007'
    }
});

var mailOptions = {
    from: 'agung040100@gmail.com',
    to: 'agungbinunju040100@gmail.com',
    subject: 'Sending Email using Nodejs',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log('Email sent: ' + info.response);
});
