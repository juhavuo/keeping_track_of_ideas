const Idea = require('../models/idea');
const User = require('../models/user');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const session = require('express-session');
const passport = require('passport');


/*
  To save an idea to the database.
*/
exports.save_idea = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.status(403).json({
        error: err
      });
    } else {
      const idea = new Idea({
        _id: new mongoose.Types.ObjectId(),
        owner: authData.user.username,
        owner_id: authData.user._id,
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
  });

}

/*
  For testing purposes, finds all ideas needs authentication as LOCAL_ADMIN
*/
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

/*
  Find all ideas from one user, needs token of that user
*/
exports.find_all_ideas_from_user = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log(authData.user.username);
      Idea.find({
          owner: authData.user.username
        })
        .exec()
        .then(ideas => {
          res.status(200).json(ideas);

        }).catch(ideas_find_error => {
          res.status(500).json({
            error: ideas_find_error
          });
        });
    }
  });

}

/*
  find all public ideas, needs no authentication
*/
exports.find_all_public_ideas = (req, res) => {

  console.log("userproperty");
  const userproperty = req._passport.instance._userproperty;

  console.log(userproperty);

  Idea.find({'is_private': false})
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

/*
   Finds all public ideas with tag, no authentication
*/
exports.find_public_ideas_by_tag = (req, res) => {
  const searched_tag = req.params.t;
  Idea.find({$and: [{'is_private': false}, {keywords: searched_tag}]
    })
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

/*
  Find public ideas between timepoints, no authentication needed
*/
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
      res.status(500).json({
        error: err
      });
    });
}

/*
  Changes the is_private property of idea, needs user authentcation
*/
exports.update_publicity_of_idea = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const id = req.params.ideaId;
      const is_private = req.body.is_private;

      Idea.updateOne({_id: id}, {$set: {is_private: is_private}})
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
  });
}

/*
  Adds like to idea, needs authentication token from user,
  idea can't be liked, if user has already liked an idea.
  Instead of number of likes, the list of user ids is stored in database
*/
exports.add_like_to_idea = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
        const userId = authData.user._id;
        const ideaId = req.params.ideaId;

        Idea.findById(ideaId)
        .exec()
        .then(result =>{
          if(result != null){
            let likers = result.liked_by;
            let userIdFound = false;
            for(let i = 0; i< likers.length; ++i){
              if(likers[i] == userId){
                userIdFound = true;
                break;
              }
            }
            if(userIdFound){
              res.status(200).json({message: 'already liked'});
            }else{
              likers.push(userId);
              Idea.updateOne({_id: ideaId}, {$set: {liked_by: likers}})
                .exec()
                .then(result =>{
                    res.status(200).json(result);
                }).catch(updateError =>{
                  res.status(500).json({error: updateError});
                })
            }
          }else{
            res.status(200).json({message: 'no such id'});
          }
        }).catch(findError =>{
          res.status(500).json({error: findError});
        });

    }
  });
}

/*
  To add comment to idea, needs user authentication token,
  new comments are pushed to database
*/
exports.add_comment_to_idea = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {

      const idea_id = req.params.ideaId;

      const comment = {
        commenter_name: authData.user.username,
        commenter_id: authData.user._id,
        comment_text: req.body.comment
      };

      Idea.updateOne({_id: idea_id}, {$push: {comments: comment}})
      .exec()
      .then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(500).json({error:err});
      })

    }
  });
}

exports.remove_comment_from_idea = (req, res )=>{
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const commenter_id = req.body.commenter_id;
      const comment_id = req.body.comment_id;
      const userId = authData.user._id;
      const ideaId = req.params.ideaId;

      if(commenter_id == userId){

        Idea.updateOne({_id: ideaId},{$pull: {comments:{_id: comment_id}}})
        .exec()
        .then(result => {
          res.status(200).json({result});
        }).catch(err =>{
          res.status(500).json({error:err});
        });
      }else{
        res.status(200).json({message: 'removal not possible'});
      }
    }
  });
}

/*
  Removes idea from database, needs user authentication
*/
exports.delete_idea = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
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
  });

}
