import io from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io({
  path: '/api/socket.io',
  withCredentials: true,
});

// socket.on('connect_error', (err) => {
//   setTimeout(() => {
//     socket.disconnect();
//     socket.connect();
//   }, 500);
//   console.log(err.message);
// });
