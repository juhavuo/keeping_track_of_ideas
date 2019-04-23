'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRound = 12;

const session = require('express-session');
const passport = require('passport');

const fs = require('fs');
const util = require('util');

const cors = require('cors');

router.use(cors());

require('dotenv').config();



const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {

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
            return done(null, {user: result});
            //
          }else{
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

router.post('/signup', (req,res)=>{
  const uname = req.body.username;
  const pword = req.body.password;

  console.log(pword);

  bcrypt.hash(pword, saltRound).then(hash =>{
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: uname,
      password: hash
    });

    console.log(hash);

    user.save().then(result =>{
      console.log(result);
      res.status(200).json(result);
    }).catch(saveError =>{
      res.status(500).json({error: saveError});
    });
  }).catch(hashError =>{
    {error: hashError};
  });
});

router.post('/login', passport.authenticate('local'), (req,res) =>{
  //const time = Math.round(new Date().getTime()/1000);
  //console.log('Passport:');
  //console.log(req.session.passport);
  //console.log('cookie');
  //console.log(req.session.cookie);
  /*
  const filepath = './testing/loginresponse' + time +'.txt';

  fs.writeFile(filepath, util.inspect(res), (err) => {
    console.log(err);
  });*/
  res.send(req.session.cookie);
});

//this must protected by password, if left...
router.post('/all', (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.compare(password,process.env.LOCAL_ADMIN_PASSWORD).then(result =>{
    if(result){
      if(username == process.env.LOCAL_ADMIN_USERCODE){
        User.find()
        .exec()
        .then(findings =>{
          res.status(200).json(findings);
        }).catch(err =>{
          res.status(500).json({error: err});
        });
      }else{
        res.status(401).json({error: 'unauthorized'});
      }
    }else{
      res.status(401).json({error: 'unauthorized'});
    }
  }).catch(bcryptError =>{
    res.status(500).json({error: bcryptError});
  });
});





module.exports = router;
