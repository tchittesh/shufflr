import axios from 'axios';
// import { BehaviorSubject } from 'rxjs';
//
// const userSubject = new BehaviorSubject(null);
const baseUrl = 'http://localhost:5000';

function createAccount(params) {
  return axios.post(`${baseUrl}/api/create-account`, params);
}

function login(params) {
  return axios.post(`${baseUrl}/api/login`, params);
}

function verifyEmail(token) {
  return axios.post(`${baseUrl}/api/verify-email/${token}`);
}

export const accountService = {
  login,
  // logout,
  // refreshToken,
  createAccount,
  verifyEmail,
  // forgotPassword,
  // validateResetToken,
  // resetPassword,
  // getAll,
  // getById,
  // create,
  // update,
  // delete: _delete,
  // user: userSubject.asObservable(),
  // get userValue () { return userSubject.value }
};
