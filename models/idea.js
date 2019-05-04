const mongoose = require('mongoose');

//for storing data about ideas
//owner_id and commenter_id are there so that it would be easier to implement changeable usernames
const ideaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: String,
  owner_id: mongoose.Schema.Types.ObjectId,
  is_private: Boolean,
  title: String,
  details: String,
  keywords: [{type: String}],
  time: {type: Date, default: Date.now()},
  links: [{type: String}],
  liked_by: [{type: String}],
  comments: [{
    commenter_name: String,
    commenter_id: String,
    comment_text: String,
    comment_time: {type: Date, default: Date.now()}
  }]
});

module.exports = mongoose.model('Idea',ideaSchema);
