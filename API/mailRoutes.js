const express = require('express')
const nodemailer = require('nodemailer')
const { mail } = require('../config/config');

const router = express.Router()

router.post('/api/send', function (req, res, next) {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: 'apikey',
      pass: mail
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const mailOptions = {
    from: `"Tojj" <info@tojj.se>`,
    to: req.body.email,
    subject: req.body.subject,
    html: req.body.message
  }
  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.error('there was an error: ', err);
    } else {
      console.log('here is the res: ', res)
    }
  })
})

module.exports = router;