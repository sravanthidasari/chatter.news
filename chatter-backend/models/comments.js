const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema(
  {
    articleId: { type: String, required: true },
    comment: { type: String, required: true },
    userId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Comment", commentsSchema);
