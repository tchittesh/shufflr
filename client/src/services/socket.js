import io from 'socket.io-client';

const socketUrl = 'http://localhost:5000';

// eslint-disable-next-line import/prefer-default-export
export const socket = io(socketUrl, {
  withCredentials: true,
}).connect(socketUrl);
