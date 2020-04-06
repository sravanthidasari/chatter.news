const mongoose = require('mongoose');

var articleSchema = mongoose.Schema(
  {
  date: {type: Date, required: true},
  title: {type: String, required: true},
  image: {type: String, required: true},
  description: {type: String, required: true},
},
{
  timestamps: true
}

);


module.exports = mongoose.model('Article', articleSchema)