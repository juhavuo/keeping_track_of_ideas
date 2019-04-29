const Idea = require('../models/idea');
const User = require('../models/user');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const session = require('express-session');
const passport = require('passport');

exports.save_idea = (req, res) => {

  const idea = new Idea({
    _id: new mongoose.Types.ObjectId(),
    owner: req.body.owner,
    is_private: req.body.is_private,
    title: req.body.title,
    details: req.body.details,
    keywords: req.body.keywords,
    links: req.body.links
  });

  idea.save().then(result => {
    res.status(200).json(idea);
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.find_all_ideas = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.compare(password, process.env.LOCAL_ADMIN_PASSWORD).then(result => {
    if (result) {
      if (username == process.env.LOCAL_ADMIN_USERCODE) {
        Idea.find()
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

exports.find_all_ideas_from_user = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        authData
      });
    }
});
/*
 const uname = req.body.username;
 Idea.find({owner: uname})
   .exec()
   .then(ideas => {
     res.status(200).json(ideas);

   }).catch(ideas_find_error => {
     res.status(500).json({error: ideas_find_error});
   });*/

}

exports.find_all_public_ideas = (req, res) => {

  console.log("userproperty");
  const userproperty = req._passport.instance._userproperty;

  console.log(userproperty);

  Idea.find({
      'is_private': false
    })
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    }).catch(err => {
      res.status(500).json({
        error,
        err
      });
    });
}

exports.find_public_ideas_by_tag = (req,res)=>{
  const searched_tag = req.params.t;
  Idea.find({$and:[{'is_private': false},{keywords: searched_tag}]})
  .exec()
  .then(docs =>{
    res.status(200).json(docs);
  }).catch(err =>{
    res.status(500).json({error:err});
  });
}

exports.find_public_ideas_certain_time = (req, res) => {
  const timeline_begin = req.body.timeline_begin;
  const timeline_end = req.body.timeline_end;
  Idea.find({
      $and: [{
        'is_private': false
      }, {
        'time': {
          $gt: new Date(timeline_begin),
          $lt: new Date(timeline_end)
        }
      }]
    })
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    }).catch(err => {
      res.status(500).json({error: err});
    });
}

exports.update_publicity_of_idea = (req, res) => {
  const id = req.params.ideaId;
  const is_private = req.body.is_private;

  Idea.updateOne({
      _id: id
    }, {
      $set: {
        is_private: is_private
      }
    })
    .exec()
    .then(result => {
      res.status(200).json({
        result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.delete_idea = (req, res) => {
  const id = req.params.ideaId;
  console.log(id);
  Idea.remove({
      _id: id
    })
    .exec()
    .then(result => {
      console.log('idea with id ' + id + ' got removed');
      res.status(200).json(result);
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
}
