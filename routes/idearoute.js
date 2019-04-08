const Idea = require('../models/idea');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', (req, res) => {



  // first with fixed values
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

module.exports = router;
