const socket = require('socket.io');

const searchPool = [];
const emailToSocket = new Map();
const matches = new Map();

function shuffle(array) {
  let currentIndex = array.length; let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// try to match everybody every one second
setInterval(() => {
  if (searchPool.length < 2) {
    return;
  }
  shuffle(searchPool);
  while (searchPool.length > 1) {
    const email1 = searchPool.pop();
    const email2 = searchPool.pop();
    matches.set(email1, email2);
    matches.set(email2, email1);
    emailToSocket.get(email1).emit('matchFound', {
      email: email2,
    });
    emailToSocket.get(email2).emit('matchFound', {
      email: email1,
    });
    console.log('after match', email1, email2);
    debugPrintAll();
  }
}, 1000);

function debugPrintAll() {
  console.log(searchPool);
  console.log(emailToSocket.keys());
  console.log(matches);
}

function addToPool(email) {
  if (!emailToSocket.get(email)) {
    return;
  }
  if (!searchPool.includes(email)) {
    searchPool.push(email);
  }
}

function removeFromPool(email) {
  if (!emailToSocket.get(email)) {
    return false;
  }
  const index = searchPool.findIndex((x) => x == email);
  if (index != -1) {
    searchPool.splice(index, 1);
    return true;
  }
  return false;
}

function initialize(server, sessionMiddleware) {
  const socketOptions = {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  };
  const io = socket(server, socketOptions)
      .use(function(socket, next) {
        sessionMiddleware(socket.request, {}, next);
      });

  // everything related to io will go here
  io.on('connection', (socket) => {
    console.log('connected');
    debugPrintAll();
    // when new user join room
    if (!socket.request || !socket.request.session ||
      !socket.request.session.passport ||
      !socket.request.session.passport.user) {
      console.log('no auth', socket);
      return;
    }
    const email = socket.request.session.passport.user;
    emailToSocket.set(email, socket);

    socket.on('search', () => {
      console.log('search');
      debugPrintAll();
      addToPool(email);
      socket.emit('searchReceived');
      console.log('after search');
      debugPrintAll();
    });

    socket.on('cancel', () => {
      console.log('cancel');
      debugPrintAll();
      if (removeFromPool(email)) {
        // only if the cancel actually happened
        socket.emit('cancelReceived');
      }
      console.log('after cancel');
      debugPrintAll();
    });

    socket.on('send', (text) => {
      console.log('send');
      debugPrintAll();
      const matchedEmail = matches.get(email);
      if (!matchedEmail) {
        return;
      }
      emailToSocket.get(matchedEmail).emit('message', {
        text: text,
      });
      socket.emit('sendReceived');
      console.log('after send');
      debugPrintAll();
    });

    socket.on('exit', () => {
      console.log('exit');
      debugPrintAll();
      const matchedEmail = matches.get(email);
      if (matchedEmail) {
        matches.delete(matchedEmail);
        emailToSocket.get(matchedEmail).emit('partnerDisconnected');
      }
      matches.delete(email);
      socket.emit('exitReceived');
      console.log('after exit');
      debugPrintAll();
    });

    socket.on('disconnect', () => {
      console.log('dc');
      debugPrintAll();
      removeFromPool(email);
      emailToSocket.delete(email);
      const matchedEmail = matches.get(email);
      if (matchedEmail) {
        matches.delete(matchedEmail);
        emailToSocket.get(matchedEmail).emit('partnerDisconnected');
      }
      matches.delete(email);
      console.log('after dc');
      debugPrintAll();
    });
  });
}

module.exports.initialize = initialize;
