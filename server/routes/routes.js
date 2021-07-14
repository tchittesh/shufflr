const express = require('express');
const passport = require('passport');
const controllers = require('../controllers/controllers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
    '/login', passport.authenticate('local'),
    (req, res) => res.status(200).json({body: 'Hello from the server!'}));
router.post('/create-account', controllers.createAccount);
router.post('/verify-email/:emailToken', controllers.verifyEmail);

module.exports = router;
