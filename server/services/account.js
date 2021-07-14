require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sql = require('./mysql');


async function findUserByEmail(email) {
  const [rows] =
      await sql.pool.execute('SELECT * FROM user WHERE email = ?', [email]);
  return rows.length == 0 ? [false, null] : [true, rows[0]];
}

async function emailExists(email) {
  return findUserByEmail(email)[0];
}

async function createUser(user) {
  const emailToken = crypto.randomBytes(30).toString('hex').substr(0, 30);
  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(user.password, salt);
  await sql.pool.execute(
      'INSERT INTO user (email, password, emailToken) VALUE (?, ?, ?)',
      [user.email, passwordHash, emailToken]);
  return emailToken;
}

async function verifyEmail(emailToken) {
  await sql.pool.execute(
      'UPDATE user SET verified = true WHERE emailToken = ?',
      [emailToken]);
}


module.exports.findUserByEmail = sql.handleFatalErrors(findUserByEmail);
module.exports.emailExists = sql.handleFatalErrors(emailExists);
module.exports.createUser = sql.handleFatalErrors(createUser);
module.exports.verifyEmail = sql.handleFatalErrors(verifyEmail);
