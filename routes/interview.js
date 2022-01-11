const express = require('express');
const passport = require('passport');

const router = express.Router();

const InterviewControllers = require('../controllers/interview');

router.get('/add', passport.checkAuthentication, InterviewControllers.add);
router.post('/create', passport.checkAuthentication, InterviewControllers.create);

module.exports = router;