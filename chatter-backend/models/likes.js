const mongoose = require('mongoose');

var likeSchema = mongoose.Schema({
  name: String,
  likes: [{type: Schema.ObjectId, ref: 'Likes'}],
  dislikes: [{type: Schema.ObjectId, ref: 'Dilikes'}],
  value: Boolean
});

module.exports = mongoose.model('Likes', likesSchema)
