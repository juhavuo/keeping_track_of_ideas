'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

const Usercontroller = require('../controllers/usercontroller');

const session = require('express-session');
const passport = require('passport');

const Jwthandler = require('../config/jwthandler');

const cors = require('cors');

router.use(cors());

require('dotenv').config();



router.post('/login',passport.authenticate('local'), Usercontroller.login);

router.post('/signup', Usercontroller.signup);

router.get('/logout', Usercontroller.logout);

router.post('/all', Usercontroller.find_all);

module.exports = router;
