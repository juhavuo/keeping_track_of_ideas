'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

const Usercontroller = require('../controllers/usercontroller');

const session = require('express-session');
const passport = require('passport');

const fs = require('fs');
const util = require('util');

const bcrypt = require('bcrypt');
const saltRound = 12;

const cors = require('cors');

router.use(cors());

require('dotenv').config();

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('at beginning');
    console.log(username);
    console.log(password);
    User.findOne({username:username})
    .exec()
    .then(result =>{

      if(result!=null){ //username exists in database
        console.log(result);
        const hash = result.password
        console.log(hash);
        bcrypt.compare(password,hash).then(bcryptRes=>{
          console.log('here in bcrypt beginnig');
          if(bcryptRes){
            console.log('success');
            return done(null, result);
            //
          }else{
            console.log('bcryptRes = false');
            done(null, false, {message: 'Login failed'});

            return;
          }
        }).catch(bcryptError =>{
          done(null, false, {message: 'Login error'});
          return;
        })
      }else{ //username doesn't exist in database
        done(null, false, {message: 'Login failed'});
        return;
      }
    })
    .catch(findError => {
      done(null, false, {message: 'Login error'});
      return;

  })
}));

router.post('/login', passport.authenticate('local'), Usercontroller.login);

router.post('/signup', Usercontroller.signup);

router.get('/logout', Usercontroller.logout);

router.post('/all', Usercontroller.find_all);

module.exports = router;
