const express = require('express');
const passport = require('passport');
const router = express.Router();

const MainControllers = require('../controllers/index');

router.get('/', MainControllers.showHome);
router.get('/dashboard', passport.checkAuthentication, MainControllers.showDashboard);
router.get('/:companyName&:interviewDate', MainControllers.companyWiseInterviews);
router.get('/downloadCsv', passport.checkAuthentication, require('../config/downloadCSV').downloadingStart);

router.use('/user', require('./user'));
router.use('/student', require('./student'));
router.use('/interview', require('./interview'));

module.exports = router;