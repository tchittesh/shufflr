
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const email = require('./email');

const databasePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();
console.log('Database connection pool created');

const sessionStore = new MySQLStore({}, databasePool);

function alertIfFatalError(err) {
  if (!err.fatal) {
    return;
  }
  const errorMsg = `Error code: ${err.code}\n` +
      `Error no: ${err.errno}\n` +
      `Error fatal: ${err.fatal}\n` +
      `Error sql: ${err.sql}\n` +
      `Error sqlState: ${err.sqlState}\n` +
      `Error sqlMessage: ${err.sqlMessage}\n`;
  email.sendEmail({
    from: process.env.EMAIL,
    to: 'tchittesh@gmail.com',
    subject: 'DATABASE FATAL ERROR',
    text: errorMsg,
  }).then(
      () => console.log('FATAL database error. Email sent successfully.'),
  ).catch(
      () => console.log('FATAL database error. Email failed to send.'),
  );
}

const handleFatalErrors = (fn) => (...args) =>
  fn(...args).catch((err) => {
    alertIfFatalError(err);
    throw err;
  });

module.exports.handleFatalErrors = handleFatalErrors;
module.exports.pool = databasePool;
module.exports.sessionStore = sessionStore;
