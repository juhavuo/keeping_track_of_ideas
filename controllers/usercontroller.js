const User = require('../models/user');

const session = require('express-session');
const passport = require('passport');

const fs = require('fs');
const util = require('util');

const bcrypt = require('bcrypt');
const saltRound = 12;
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  console.log('exports login:');
  console.log(req.session.passport.user);

  const user = req.session.passport.user;
  jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '2h'}, (err, token) => {
    res.json({token});
  });
}

exports.signup = (req, res) => {
  const uname = req.body.username;
  const pword = req.body.password;

  console.log(pword);

  bcrypt.hash(pword, saltRound).then(hash => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: uname,
      password: hash
    });

    console.log(hash);

    user.save().then(result => {
      console.log(result);
      res.status(200).json(result);
    }).catch(saveError => {
      res.status(500).json({
        error: saveError
      });
    });
  }).catch(hashError => {
    res.status(500).json({
      error: hashError
    })
  });
}

exports.logout = (req, res) => {

  req.session.destroy();
  console.log('at logout, userproperty');
  if (req.session != undefined) {
    console.log(req.session.cookie);
  } else {
    console.log('session destroyded');
  }
  res.status(200).json({
    message: 'logging out'
  });
}

//this must protected by password, if left...
exports.find_all = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.compare(password, process.env.LOCAL_ADMIN_PASSWORD).then(result => {
    if (result) {
      if (username == process.env.LOCAL_ADMIN_USERCODE) {
        User.find()
          .exec()
          .then(findings => {
            res.status(200).json(findings);
          }).catch(err => {
            res.status(500).json({
              error: err
            });
          });
      } else {
        res.status(401).json({
          error: 'unauthorized'
        });
      }
    } else {
      res.status(401).json({
        error: 'unauthorized'
      });
    }
  }).catch(bcryptError => {
    res.status(500).json({
      error: bcryptError
    });
  });
}
