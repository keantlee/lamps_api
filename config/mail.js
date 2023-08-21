global.nodemailer = require('nodemailer');

global.transporter = nodemailer.createTransport({
    //service: 'gmail.com',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        // user: 'noreply.covidapp@mail.da.gov.ph',
        // pass: 'xngjcyjtlnhmxssq',
        user: 'support.sadd@da.gov.ph',
        pass: '7!91KFoqryQ-4PCm'
    }
});

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      const nextLine = "\n";
      console.log(`Mail connection has not established! ${nextLine} Error: ${error}`);
    } else {
      console.log(`Mail connection is successsfully established!`);
    }
});