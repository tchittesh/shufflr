import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

import { socket } from './socket';

const emailObservable = new BehaviorSubject(null);

function createAccount(params) {
  return axios.post('/api/create-account', params);
}

function login(params) {
  return axios.post('/api/login', params, { withCredentials: true })
    .then(() => {
      socket.connect();
      console.log('tried to reconnect socket');
      emailObservable.next(params.email);
      console.log(params.email);
    });
}

function logout() {
  return axios.get('/api/logout', { withCredentials: true })
    .then(() => emailObservable.next(null));
}

function checkCookie() {
  return axios.get('/api/check-cookie', { withCredentials: true })
    .then((res) => {
      socket.connect();
      emailObservable.next(res.data.email);
    });
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
  checkCookie,
  logout,
  createAccount,
  verifyEmail,
  forgotPassword,
  resetPassword,
  // getAll,
  // getById,
  // create,
  // update,
  // delete: _delete,
  emailObservable,
  get emailAddress() { return emailObservable.value; },
};
