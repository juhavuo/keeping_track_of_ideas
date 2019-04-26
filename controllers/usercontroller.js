const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRound = 12;
const mongoose = require('mongoose');

exports.login = (req,res) =>{
  res.status(200).json({message: 'OK'});
}

exports.signup = (req,res)=>{
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
    res.status(500).json({error: hashError})
  });
}

exports.login = (req,res) =>{
  res.status(200).json({message: 'OK'});
}

exports.logout =(req,res) =>{
  req.session.destroy();
  console.log('at logout, userproperty');
  console.log(req._passport);
  res.status(200).json({message: 'logging out'});
}

//this must protected by password, if left...
exports.find_all = (req, res)=>{
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
}
