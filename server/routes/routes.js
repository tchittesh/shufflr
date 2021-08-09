const express = require('express');
const passport = require('passport');
const controllers = require('../controllers/controllers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
    '/login', passport.authenticate('local'),
    (_, res) => res.status(200).end());
router.get('/check-cookie', controllers.checkCookie);
router.get(
    '/logout', passport.authenticate('local'),
    (req, res) => {
      console.log(req);
      req.logout();
      res.status(200).end();
    });
router.post('/create-account', controllers.createAccount);
router.post('/verify-email/:emailToken', controllers.verifyEmail);
router.post('/forgot-password', controllers.forgotPassword);
router.post('/reset-password', controllers.resetPassword);

module.exports = router;
