import io from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io({
  path: '/api/socket.io',
  withCredentials: true,
}).connect();
