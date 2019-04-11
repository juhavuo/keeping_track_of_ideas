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
    }).catch(saveError =>{
      res.status(500).json({error: saveError});
    });
  }).catch(hashError =>{
    {error: hashError};
  });
});

router.post('/login', (req,res)=>{
  const uname = req.body.username;
  const pword = req.body.password;

  User.findOne({username:uname})
  .exec()
  .then(result =>{

    if(result!=null){
      const hash = result.password
      bcrypt.compare(pword,hash).then(bcryptRes=>{
        if(bcryptRes){
          res.status(200).json({message: "login succeeded"});
        }else{
          res.status(200).json({message: "login failed"});
        }
      }).catch(bcryptError =>{
        res.status(500).json({error, bcryptError});
      })
    }else{
      res.status(200).json({message: "login failed"});
    }
  })
  .catch(findError => {
    res.status(500).json({error: findError});
  });
});

module.exports = router;
