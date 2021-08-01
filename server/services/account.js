const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysqlHelper = require('./mysql');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

function dateToMysqlString(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} `+
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

async function findUserByEmail(email) {
  const [rows] = await mysqlHelper.pool.execute(
      'SELECT * FROM user WHERE email = ?', [email]);
  return rows.length == 0 ? [false, null] : [true, rows[0]];
}

async function emailExists(email) {
  const [exists] = await findUserByEmail(email);
  return exists;
}

async function createUser(user) {
  const emailToken = crypto.randomBytes(45).toString('hex').substr(0, 45);
  const passwordHash = hashPassword(user.password);
  await mysqlHelper.pool.execute(
      'INSERT INTO user (email, password, emailToken) VALUE (?, ?, ?)',
      [user.email, passwordHash, emailToken]);
  return emailToken;
}

async function deleteUser(user) {
  await mysqlHelper.pool.execute(
      'DELETE FROM user WHERE email=?',
      [user.email]);
}

async function verifyEmail(emailToken) {
  await mysqlHelper.pool.execute(
      'UPDATE user SET verified = true WHERE emailToken = ?',
      [emailToken]);
}

async function setResetPasswordToken(email) {
  const resetPasswordToken =
    crypto.randomBytes(45).toString('hex').substr(0, 45);
  const resetPasswordExpiration = new Date();
  resetPasswordExpiration.setMinutes(resetPasswordExpiration.getMinutes() + 15);
  await mysqlHelper.pool.execute(
      'UPDATE user SET resetPasswordToken = ?, resetPasswordExpiration = ?' +
      ' WHERE email = ?',
      [resetPasswordToken, dateToMysqlString(resetPasswordExpiration), email]);
  return resetPasswordToken;
}

async function getResetPasswordTokenExpiration(resetPasswordToken) {
  const [rows] = await mysqlHelper.pool.execute(
      'SELECT resetPasswordExpiration FROM user WHERE resetPasswordToken = ?',
      [resetPasswordToken]);
  return rows.length == 0 ?
    [false, null] : [true, rows[0].resetPasswordExpiration];
}

async function changePassword(resetPasswordToken, newPassword) {
  const passwordHash = hashPassword(newPassword);
  await mysqlHelper.pool.execute(
      'UPDATE user SET password = ?, resetPasswordExpiration = ?' +
      ' WHERE resetPasswordToken = ?',
      [passwordHash, dateToMysqlString(new Date(0)), resetPasswordToken]);
}

module.exports.findUserByEmail = mysqlHelper.handleFatalErrors(findUserByEmail);
module.exports.emailExists = mysqlHelper.handleFatalErrors(emailExists);
module.exports.createUser = mysqlHelper.handleFatalErrors(createUser);
module.exports.deleteUser = mysqlHelper.handleFatalErrors(deleteUser);
module.exports.verifyEmail = mysqlHelper.handleFatalErrors(verifyEmail);
module.exports.setResetPasswordToken =
  mysqlHelper.handleFatalErrors(setResetPasswordToken);
module.exports.getResetPasswordTokenExpiration =
  mysqlHelper.handleFatalErrors(getResetPasswordTokenExpiration);
module.exports.changePassword = mysqlHelper.handleFatalErrors(changePassword);
