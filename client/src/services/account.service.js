import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

const userSubject = new BehaviorSubject(null);

function createAccount(params) {
  return axios.post('/api/create-account', params);
}

function login(params) {
  return axios.post('/api/login', params, { withCredentials: true })
    .then(() => userSubject.next(params.email));
}

function verifyEmail(token) {
  return axios.post(`/api/verify-email/${token}`);
}

function forgotPassword(email) {
  return axios.post('/api/forgot-password/', { email });
}

function resetPassword(params) {
  return axios.post('/api/reset-password/', params);
}

// eslint-disable-next-line import/prefer-default-export
export const accountService = {
  login,
  // logout,
  createAccount,
  verifyEmail,
  forgotPassword,
  resetPassword,
  // getAll,
  // getById,
  // create,
  // update,
  // delete: _delete,
  // user: userSubject.asObservable(),
  get emailAddress() { return userSubject.value; },
};
