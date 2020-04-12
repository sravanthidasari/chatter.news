const mongoose = require("mongoose");

var articleSchema = mongoose.Schema(
  {
    headLine: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Article", articleSchema);
