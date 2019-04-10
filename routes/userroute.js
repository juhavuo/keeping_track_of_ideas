'use strict';

const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRound = 12;

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
    }).catch(err2 =>{
      res.status(500).json({error: err2});
    });
  }).catch(err =>{
    {error: err};
  });
});

module.exports = router;
