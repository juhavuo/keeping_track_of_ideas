const Idea = require('../models/idea');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', (req, res) => {

  /*
  const owner = req.body.owner;
  const private_var = req.body.private;
  const title_var = req.body.title;
  const details_var = req.body.details;
  const keywords_array = req.body.keywords;
  const links_array = req.body.links;*/

  const idea = new Idea({
    _id: new mongoose.Types.ObjectId(),
    owner: req.body.owner,
    private: req.body.private,
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
});

//for testing purposes, maybe for superuser, needs to add authorization
router.get('/all', (req,res)=>{
  Idea.find()
  .exec()
  .then(docs => {
    res.status(200).json(docs);
  }).catch(err =>{
    res.status(500).json({error,err});
  });
});

//get all public ideas, this is for all
router.get('/public', (req,res) =>{
  Idea.find({'private': false})
  .exec()
  .then(docs => {
    res.status(200).json(docs);
  }).catch(err =>{
    res.status(500).json({error,err});
  });
});

//testing to get messages from certain time period
router.get('/public/timetest', (req,res) =>{
  const timeline_begin = req.body.timeline_begin;
  const timeline_end = req.body.timeline_end;
  Idea.find({$and: [{'private': false},{'time':{$gt: new Date(timeline_begin), $lt: new Date(timeline_end)}}]})
  .exec()
  .then(docs =>{
    res.status(200).json(docs);
  }).catch(err=>{
    res.status(500).json(docs);
  });
});

module.exports = router;
