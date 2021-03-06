const User = require('../models/user');
const Idea = require('../models/idea');

const session = require('express-session');
const passport = require('passport');

const fs = require('fs');
const util = require('util');

const bcrypt = require('bcrypt');
const saltRound = 12;
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

/*
  Login. Creates token to be sent to client that is needed in authentication in
  many methods.
*/
exports.login = (req, res) => {
  console.log('exports login:');
  console.log(req.session.passport.user);

  const user = req.session.passport.user;
  jwt.sign({
    user
  }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  }, (err, token) => {
    console.log('sending id');
    console.log(req.session.passport.user._id);
    res.json({
      'token': token,
      'id': req.session.passport.user._id
    });
  });
}

/*
  Adding user to the database, user needs to have unique username
*/
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


/*
  Logs out the user and destroys the session attached to request
*/
exports.logout = (req, res) => {
  console.log('at logout');
  console.log(req.session);
  req.session.destroy();
  if (req.session != undefined) {
    console.log(req.session.cookie);
  } else {
    console.log('session destroyded');
  }
  res.status(200).json({
    message: 'logging out'
  });
}

/*
  Gets all user information, authentication with LOCAL_ADMIN credentials
*/
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
