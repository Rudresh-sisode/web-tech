const nodemailer =require('nodemailer');

module.exports = class SmtpService  {
    async sendMail(to , from, mailMessage, subject) {
        let smtpTransport = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.SECRET
            }
        });

        try {
            let info = await smtpTransport.sendMail({
                from: 'Career Portal' + ' ' + process.env.FROM,
                to: to,
                subject: subject,
                text: mailMessage,
                html: `<p>${mailMessage}</p>`
            }, null);
            //console.log(info);
            return true;
        }
        catch(err){
            console.log('service smtp error ',JSON.stringify(err));
            return false;
        }        
    }

}

