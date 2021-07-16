require('dotenv').config();
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

// EXAMPLE USAGE
// sendEmail({
//   from: process.env.EMAIL,
//   to: 'tchittesh@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!',
// }).then(
//     () => console.log('EMAILED'),
// ).catch(
//     () => console.log('FAILED'),
// );
const sendEmail = async (emailOptions) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

module.exports.sendEmail = sendEmail;