const Idea = require('../models/idea');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', (req, res) => {

  // first with fixed values
  const owner = 'test_owner';
  const private_var = true;
  const title_var = 'test_title';
  const details_var = 'test_details';
  const keywords_array = ['test1', 'test2'];
  const links_array = ['testing.test/plaaplaa', 'still.testing.test/jes'];

  const idea = new Idea({
    _id: new mongoose.Types.ObjectId(),
    private: private_var,
    title: title_var,
    details: details_var,
    keywords: keywords_array,
    links: links_array
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
