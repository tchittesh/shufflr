const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const account = require('./account');

function authenticationMiddleware() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).end();
  };
}

function initPassport() {
  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(async function(email, done) {
    account.findUserByEmail(email).then(
        ([found, user]) => {
          if (!found) {
            done(Error('Authentication failed'));
          }
          done(null, user);
        },
    ).catch(
        (err) => done(err),
    );
  });

  passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        account.findUserByEmail(email).then(
            ([found, user]) => {
              // User not found or not validated
              if (!found || !user.verified) {
                return done(null, false);
              }
              // Always use hashed passwords and fixed time comparison
              bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) {
                  return done(err);
                }
                if (!isValid) {
                  return done(null, false);
                }
                return done(null, user);
              });
            },
        ).catch(
            (err) => done(err, null),
        );
      }));

  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports.initPassport = initPassport;
