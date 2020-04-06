const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
  comment: {type: String, required: true}
},
{
  timestamps: true
}
);


module.exports = mongoose.model('Comments', commentsSchema)