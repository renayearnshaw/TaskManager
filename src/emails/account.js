const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = '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'

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'renayearnshaw@gmail.com',
        subject: 'Welcome!',
        text: `Welcome to the Task Manager app, ${name}. Let me know how you get along with it.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'renayearnshaw@gmail.com',
        subject: 'We\'re sorry to see you go',
        text: `Hello ${name}, \nWe've received your request to leave the Task Manager app. Please let us know why you chose to leave us.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}