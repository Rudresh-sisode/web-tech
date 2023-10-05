require('dotenv').config();
import * as nodemailer from 'nodemailer';
//process.env.
export class SmtpService {
     sendMail(to: string, mailMessage: string, subject: string,attachment?:any, cc?: string[], attachmentFilePath?: string, attachmentFileName?: string): void {

        const smtpHost:String = process.env.SMTP_HOST as String;

        let smtpTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_SECRET
            }
        } as any);

        try {

            let mailOptions:any = {
                from: process.env.PROJECT_NAME + ' ' + process.env.SMTP_FROM,
                to: to,
                subject: subject,
                text: mailMessage,
                html: `<p>${mailMessage}</p>`
            };

            if (attachment) {
                mailOptions.attachments = [
                    {
                        filename: attachment.filename,
                        content: attachment.content
                    }
                ];
            }

            if (cc && cc.length > 0) {
                mailOptions.cc = cc;
            }

            if (attachmentFilePath) {
                mailOptions.attachments = [
                  {
                    filename: attachmentFileName,
                    path: attachmentFilePath,
                  },
                ];
              }
            let info:any =  smtpTransport.sendMail(mailOptions);
            console.log(info);
            
            // return true;
        }
        catch(err){
            console.log(JSON.stringify(err));
            // return false;
        }        
    }

}