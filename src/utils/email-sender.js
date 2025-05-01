const nodemailer = require('nodemailer');
const {
  getWelcomeMessageTemplate,
  getErrorTemplateMessage,
  getPasswordResetTemplate,
} = require('./template-email');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendWelcomeMessage = async (email, fullname) => {
  await transporter.sendMail({
    from: `Books19<${process.env.EMAIL}>`,
    to: email,
    subject: 'Welcome on Books19 !',
    html: getWelcomeMessageTemplate(fullname),
  });
};

const sendAPIErrorMessageByEmail = async (endpoint, name, message) => {
  await transporter.sendMail({
    from: `Books19<${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: 'Error on Books19 !',
    html: getErrorTemplateMessage(endpoint, name, message),
  });
};

const sendResetPasswordEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: `Books19<${process.env.EMAIL}>`,
    to: email,
    subject: 'Password Reset',
    html: getPasswordResetTemplate(resetLink),
  });
};

module.exports = {
  sendWelcomeMessage,
  sendAPIErrorMessageByEmail,
  sendResetPasswordEmail,
};
