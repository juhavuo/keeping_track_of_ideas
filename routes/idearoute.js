const Idea = require('../models/idea');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const cors = require('cors');

router.use(cors());

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
});

//for testing purposes, maybe for superuser, needs to add authorization then
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
  Idea.find({'is_private': false})
  .exec()
  .then(docs => {
    res.status(200).json(docs);
  }).catch(err =>{
    res.status(500).json({error,err});
  });
});

//testing to get messages from certain time period
router.post('/public/timetest', (req,res) =>{
  const timeline_begin = req.body.timeline_begin;
  const timeline_end = req.body.timeline_end;
  Idea.find({$and: [{'is_private': false},{'time':{$gt: new Date(timeline_begin), $lt: new Date(timeline_end)}}]})
  .exec()
  .then(docs =>{
    res.status(200).json(docs);
  }).catch(err=>{
    res.status(500).json(docs);
  });
});


//changing the posted idea form public to private or other way around, needs autohorization of that user added later
router.patch('/:ideaId/changeVisibility', (req,res)=>{
  const id = req.params.ideaId;
  const is_private = req.body.is_private;

  Idea.updateOne({_id: id},{$set: {is_private: is_private}})
  .exec()
  .then(result => {
    res.status(200).json({result});
  }).catch(err =>{
    res.status(500).json({error: err});
  });
});

//delete the posted // IDEA
router.delete('/:ideaId', (req,res) =>{
  const id = req.params.ideaId;
  console.log(id);
  Idea.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json(result);
  }).catch(err =>{
    res.status(500).json({error: err});
  });
});

module.exports = router;
