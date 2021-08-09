import io from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io({
  path: '/api/socket.io',
  withCredentials: true,
});

// client-side
socket.on('connect_error', (err) => {
  // setTimeout(() => {
  //   socket.connect();
  // }, 500);
  console.log('connect error'); // true
  console.log(err instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});

setInterval(() => {
  console.log('cookies', document.cookie);
}, 500);
