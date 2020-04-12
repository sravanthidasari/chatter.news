const mongoose = require("mongoose");

var reactionSchema = mongoose.Schema({
  userId: { type: String, required: true },
  objectType: { type: String, required: true },
  objectId: { type: String, required: true },
  reaction: { type: Number, require: true }
});

module.exports = mongoose.model("Reactions", reactionSchema);
