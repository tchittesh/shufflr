require('dotenv').config();
const Yup = require('yup');

const account = require('../services/account');
const email = require('../services/email');

const validationSchema = Yup.object().shape({
  email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
  password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
});

const handleErrors = (route) => async (req, res, next) =>
  Promise.resolve(route(req, res, next)).catch((err) => {
    console.error(err);
    throw err;
  });

async function verifyEmail(req, res) {
  console.log(req.params.emailToken);
  await account.verifyEmail(req.params.emailToken);
  return res.status(200).json({
    body: 'Successfully verified email',
  });
}

async function createAccount(req, res) {
  const valid = await validationSchema.isValid(req.body);
  if (!valid) {
    return res.status(400);
  }
  const exists = await account.emailExists(req.body.email);
  if (exists) {
    return res.status(400).json({
      body: 'There is already a registered account with this email',
    });
  }
  const emailToken = await account.createUser(req.body);
  const verificationUrl =
    `${process.env.FRONTEND_BASE_URL}/verify-email/${emailToken}`;
  const emailContent = `
    Thanks for registering!
    Please click the below link to verify your email address:
    ${verificationUrl}
  `;
  await email.sendEmail({
    from: process.env.EMAIL,
    to: req.body.email,
    subject: 'Verify your email for Shufflr',
    text: emailContent,
  });
  return res.status(200).json({
    body: 'Successfully created account',
  });
}

module.exports.createAccount = handleErrors(createAccount);
module.exports.verifyEmail = handleErrors(verifyEmail);
