// Import dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mysqlHelper = require('./services/mysql');
const auth = require('./services/auth');

// Create a new express application called 'app'
const app = express();

// Set our backend port to be either an environment variable or port 5000
const port = process.env.PORT || 5000;

// This application level middleware prints incoming requests to the
// servers console
app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`);
  next();
});

// Use passport session-based middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: mysqlHelper.sessionStore,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
auth.initPassport();

// Set up the bodyParser middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Set up the CORs middleware
app.use(cors());

// Require Route
const api = require('./routes/routes');
// Configure app to use route
app.use('/api/', api);

// This middleware informs the express application to
// serve our compiled React files
if (process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Catch any bad requests
app.get('*', (req, res) => {
  res.status(400).json({});
});

// Set our server to listen on the port defiend by our port variable
app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));
