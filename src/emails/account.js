const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = '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'

sgMail.setApiKey(SENDGRID_API_KEY);

sgMail.send({
    to: 'renay.earnshaw@uktv.co.uk',
    from: 'renayearnshaw@gmail.com',
    subject: 'This is a test',
    text: 'I hope this gets to you!'
})