const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'TrwxFDVrQP0bVkGxJ68tuzNyH@gmail.com',
    pass: 'aimhaolcczsrfguq'
  }
});