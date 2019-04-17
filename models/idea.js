const mongoose = require('mongoose');


//https://stackoverflow.com/questions/10006218/which-schematype-in-mongoose-is-best-for-timestamp

const ideaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: String,
  is_private: Boolean,
  title: String,
  details: String,
  keywords: [{type: String}],
  time: {type: Date, default: Date.now()},
  links: [{type: String}]

});

module.exports = mongoose.model('Idea',ideaSchema);
