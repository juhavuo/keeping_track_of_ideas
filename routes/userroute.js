'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRound = 12;

const session = require('express-session');
const passport = require('passport');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {

    console.log(username);
    console.log(password);
    User.findOne({username:username})
    .exec()
    .then(result =>{

      if(result!=null){ //username exists in database
        const hash = result.password
        console.log(hash);
        bcrypt.compare(password,hash).then(bcryptRes=>{
          if(bcryptRes){
            //res.status(200).json({message: "login succeeded"});
            console.log('success');
            return done(null, {username: username});
            //
          }else{
            done(null, false, {message: 'Login failed'});
            return;
            //res.status(200).json({message: "login failed"})
          }
        }).catch(bcryptError =>{
          done(null, false, {message: 'Login error'});
          return;
          //res.status(500).json({error, bcryptError});
        })
      }else{ //username doesn't exist in database
        done(null, false, {message: 'Login failed'});
        return;
        //res.status(200).json({message: "login failed"});
      }
    })
    .catch(findError => {
      done(null, false, {message: 'Login error'});
      return;
      //res.status(500).json({error: findError});
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
      res.status(200).json(user);
    }).catch(saveError =>{
      res.status(500).json({error: saveError});
    });
  }).catch(hashError =>{
    {error: hashError};
  });
});

router.post('/login', passport.authenticate('local'), (req,res) =>{
  res.send('end');
});



  /*
  const uname = req.body.username;
  const pword = req.body.password;

  User.findOne({username:uname})
  .exec()
  .then(result =>{

    if(result!=null){ //username exists in database
      const hash = result.password
      bcrypt.compare(pword,hash).then(bcryptRes=>{
        if(bcryptRes){
          res.status(200).json({message: "login succeeded"});
          //
        }else{
          res.status(200).json({message: "login failed"});
        }
      }).catch(bcryptError =>{
        res.status(500).json({error, bcryptError});
      })
    }else{ //username doesn't exist in database
      res.status(200).json({message: "login failed"});
    }
  })
  .catch(findError => {
    res.status(500).json({error: findError});
  });*/


module.exports = router;
