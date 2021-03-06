const socket = require('socket.io');

const searchPool = new Map();
searchPool.set('andrew.cmu.edu', []);
searchPool.set('princeton.edu', []);
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
  for (const item of searchPool) {
    const searchList = item[1];
    if (searchList.length < 2) {
      return;
    }
    shuffle(searchList);
    while (searchList.length > 1) {
      const email1 = searchList.pop();
      const email2 = searchList.pop();
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
  const emailDomain = email.split('@').pop();
  if (searchPool.has(emailDomain) &&
      !searchPool.get(emailDomain).includes(email)) {
    searchPool.get(emailDomain).push(email);
  }
}

function removeFromPool(email) {
  if (!emailToSocket.get(email)) {
    return false;
  }
  const emailDomain = email.split('@').pop();
  if (!searchPool.has(emailDomain)) {
    return false;
  }
  const index = searchPool.get(emailDomain).findIndex((x) => x == email);
  if (index != -1) {
    searchPool.get(emailDomain).splice(index, 1);
    return true;
  }
  return false;
}

function initialize(server, sessionMiddleware) {
  const io = socket(server, {path: '/api/socket.io'});

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, {}, next);
  });

  io.use((socket, next) => {
    if (!socket.request || !socket.request.session ||
      !socket.request.session.passport ||
      !socket.request.session.passport.user) {
      console.log('unauthorized', socket.request.rawHeaders);
      next(new Error('unauthorized'));
    } else {
      console.log('fine', socket.request.rawHeaders);
      next();
    }
  });

  // everything related to io will go here
  io.on('connection', (socket) => {
    debugPrintAll();
    // when new user join room
    if (!socket.request || !socket.request.session ||
      !socket.request.session.passport ||
      !socket.request.session.passport.user) {
      console.log('no auth socket');
      return;
    }
    const email = socket.request.session.passport.user;
    console.log('connected', email);
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
