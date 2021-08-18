// Import dependencies
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mysqlHelper = require('./services/mysql');
const auth = require('./services/auth');
const chatSocket = require('./services/chat');

// Create a new express application called 'app'
const app = express();

// Set our backend port to be either an environment variable or port 5000
const port = process.env.PORT || 5000;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  store: mysqlHelper.sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
  },
});

// Use passport session-based middleware
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
auth.initPassport();

// Set up the bodyParser middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use('/api/static', express.static('public'));

// Require Route
const api = require('./routes/routes');
// Configure app to use route
app.use('/api/', api);

// Catch any bad requests
app.get('*', (req, res) => {
  res.status(400).json({});
});

// Set our server to listen on the port defiend by our port variable
const server =
  app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));

chatSocket.initialize(server, sessionMiddleware);
