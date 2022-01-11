const express = require('express');
const passport = require('passport');
const router = express.Router();

const StudentControllers = require('../controllers/student');

router.get('/add', passport.checkAuthentication, StudentControllers.add);
router.post('/create', passport.checkAuthentication, StudentControllers.create);

module.exports = router;