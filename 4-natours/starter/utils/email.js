const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user,url).sendWelcome();

module.exports = class Email {

    constructor (user,url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Semih Argn <${process.env.EMAIL_FROM}>`;
    }

    createTransport(){

        if(process.env.NODE_ENV === 'production') {
            // MailChimp
            return nodemailer.createTransport({
                host: 'smtp.mandrillapp.com',
                port: 587,
                secure: false, 
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
                });
        }
        

        return nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,
            secure : false, // true for 465, false for other ports
            auth : {
                    user : process.env.EMAIL_USERNAME,
                    pass : process.env.EMAIL_PASSWORD
            }
            // Activate in gmail 'less secure app' option
        })
    };


    async send(template,subject) {
        // send the mail
        // 1 ) Render Html on Pug Template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, 
        {
            firstName : this.firstName,
            url : this.url,
            subject
        })
        


        // 2 ) Define email options
        const mailOptions = {
            from : this.from,
            to: this.to,
            subject,
            html,
            text : htmlToText.convert(html),
            // html:
        }

        // 3 ) Create a transport and send email
        
        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome','Welcome to the Natours Family!')
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token (valid for only 10 minutes')
    }

}



// const sendEmail = async options => {

//     // 1 ) Create a transporter
//     const transporter = nodemailer.createTransport({
//         host : process.env.EMAIL_HOST,
//         port : process.env.EMAIL_PORT,
//         secure : false, // true for 465, false for other ports
//         auth : {
//                     user : process.env.EMAIL_USERNAME,
//                     pass : process.env.EMAIL_PASSWORD
//         }
//         // Activate in gmail 'less secure app' option


//     });

//     // 2 ) Define the email options
//     const mailOptions = {
//         from : 'Semih Argn <smhargn@gmail.com>',
//         to: options.email,
//         subject : options.subject,
//         text : options.message,
//         // html:
//     }

//     // 3 ) Actually send the email
//     await transporter.sendMail(mailOptions);

// };

