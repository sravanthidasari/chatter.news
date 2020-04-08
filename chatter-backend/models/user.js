const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  loginId: {type: String, required: true},
  name: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema)
