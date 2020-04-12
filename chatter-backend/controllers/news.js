const news = require("express").Router();

const ObjectTypes = require("../models/objectTypes");
const Articles = require("../models/articles");
const Reactions = require("../models/reactions");
const Comments = require("../models/comments");

const getTopNewsFromBing = require("./newsApi");

function getImageUrl(newsItem) {
  if (newsItem.image && newsItem.image.thumbnail && newsItem.image.thumbnail.contentUrl) {
    return newsItem.image.thumbnail.contentUrl;
  }

  if (
    newsItem.provider &&
    newsItem.provider.length &&
    newsItem.provider[0].image &&
    newsItem.provider[0].image.thumbnail &&
    newsItem.provider[0].image.thumbnail.contentUrl
  ) {
    return newsItem.provider[0].image.thumbnail.contentUrl;
  }

  return "";
}

// Index route
news.get("/", async (req, res) => {
  const topNews = await getTopNewsFromBing();
  let articles = [];

  if (topNews && topNews.value) {
    articles = topNews.value.map(v => ({
      headLine: v.name,
      description: v.description,
      image: getImageUrl(v),
      url: v.url,
      date: v.datePublished
    }));
  }

  let newArticles = [];
  if (articles && articles.length) {
    for (let article of articles) {
      const foundArticles = await Articles.find({ url: article.url });
      if (!foundArticles || !foundArticles.length || foundArticles.length === 0) {
        newArticles.push(article);
      }
    }
  }

  let _ = await Articles.create(newArticles);
  let foundArticles = await Articles.find();

  res.status(200).json(foundArticles);
});

// Get one news article
news.get("/:id", async (req, res) => {
  let article = await Articles.findOne({ _id: req.params.id }).exec();
  if (!article) {
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  // Let's fetch the reactions for the news article as well
  let reactions = await Reactions.find({ objectType: ObjectTypes.Article, objectId: article._id });

  // Let's fetch the comments for the news article as well
  let comments = await Comments.find({ articleId: article._id });

  // Update the article object with comments and likes before returning it
  article = {
    ...article,
    reactions,
    comments
  };

  res.status(200).json(article);
});

// Get article reactions
news.get("/:id/reactions", async (req, res) => {
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  let reactions = await Reactions.find({ objectType: ObjectTypes.Article, objectId: article._id });
  res.status(200).json(reactions);
});

// Create and update reaction route
// Logic is that if you create one reaction (say like) and want to create another reaction
// (say dislike), the original reaction should be updated to dislike - this is done to allow
// only one reaction per user on a given news article
news.post("/:id/reactions", async (req, res) => {
  // We need user id for whom the reaction is being created or updated
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  // Find if the same user has already made any reaction - example user changing like to dislike etc.
  let reaction = await Reactions.findOne({
    objectType: ObjectTypes.Article,
    objectId: article._id,
    userId: req.query.userId
  });

  if (reaction) {
    // MongoDB returns the whole doc metadata?
    reaction = reaction._doc || reaction;

    // If found, then we just update the existing reaction. Meaning we only allow one reaction per user
    reaction = {
      ...reaction,
      ...req.body,
      objectType: ObjectTypes.Article,
      objectId: article._id,
      userId: req.query.userId
    };
  } else {
    // Else create a new reaction object with the incoming info and overwrite with info pertaining to the article and user
    reaction = new Reactions({
      ...req.body,
      objectType: ObjectTypes.Article,
      objectId: article._id,
      userId: req.query.userId
    });
  }

  // We choose to do upsert so it can either be update or insert depending on
  // whether the user has previously created a reaction or not
  reaction = await Reactions.updateOne({ _id: reaction._id }, reaction, { upsert: true });

  // Send the resultant reaction back as the response
  res.status(200).json(reaction);
});

// Delete the reaction by the user. User Id will come in the query string parameter for now
news.delete("/:id/reactions", async (req, res) => {
  // We need user id for whom the reaction is being created or updated
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  // Delete the matching reaction
  await Reactions.deleteOne({ objectType: ObjectTypes.Article, objectId: req.params.id, userId: req.query.userId });
  res.sendStatus(200);
});

// Get article comments
news.get("/:id/comments", async (req, res) => {
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  let comments = await Comments.find({ articleId: article._id });
  res.status(200).json(comments);
});

// Create comments route
news.post("/:id/comments", async (req, res) => {
  // We need user id for whom the comment is being created
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  // Find the article for which the comment is being added
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  comment = {
    ...req.body,
    articleId: article._id,
    userId: req.query.userId
  };

  comment = await Comments.create(comment);

  // Send the resultant comment back as the response
  res.status(200).json(comment);
});

// Get a specific comment
news.get("/:id/comments/:commentId", async (req, res) => {
  let comment = await Comments.findOne({ _id: req.params.commentId });
  if (!comment) {
    res.sendStatus(404);
    return;
  }

  comment = comment._doc || comment;

  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    res.sendStatus(404);
    return;
  }

  article = article._doc || article;

  if (comment.articleId !== article._id.toString()) {
    res.sendStatus(404);
    return;
  }

  // Let's fetch the reactions for the news article as well
  let reactions = await Reactions.find({ objectType: ObjectTypes.Comment, objectId: comment._id });
  comment = {
    ...comment,
    reactions
  };

  res.status(200).json(comment);
});

// Delete the comment by the user. User Id will come in the query string parameter for now
news.delete("/:id/comments/:commentId", async (req, res) => {
  // We need user id for whom the comment is being created
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  let comment = await Comments.findOne({ _id: req.params.commentId });
  comment = comment._doc || comment;

  if (comment.articleId !== req.params.id || comment.userId !== req.query.userId) {
    res.status(400).send("Cannot delete this comment from here ...");
    return;
  }

  // Find if the same user has already made any reaction - example user changing like to dislike etc.
  await Comments.deleteOne({ _id: comment._id });
  res.sendStatus(200);
});

// Edit artcile comments
news.put("/:id/comments/:commentId", async (req, res) => {
  // We need user id for whom the comment is being created
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  let comment = await Comments.findOne({ _id: req.params.commentId });
  comment = comment._doc || comment;

  if (comment.articleId !== req.params.id || comment.userId !== req.query.userId) {
    res.status(400).send("Cannot update this comment from here ...");
    return;
  }

  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.sendStatus(404);
    return;
  }

  comment = {
    ...comment,
    ...req.body,
    userId: req.query.userId,
    articleId: req.params.id
  };

  comment = await Comments.updateOne({ _id: comment._id }, comment);
  res.status(200).json(comment);
});

// Create and update reaction route
// Logic is that if you create one reaction (say like) and want to create another reaction
// (say dislike), the original reaction should be updated to dislike - this is done to allow
// only one reaction per user on a given news article
news.post("/:id/comments/:commentId/reactions", async (req, res) => {
  // We need user id for whom the reaction is being created or updated
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  let comment = await Comments.findOne({ _id: req.params.commentId });
  if (!comment) {
    res.sendStatus(404);
  }

  comment = comment._doc || comment;

  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.sendStatus(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  if (comment.articleId !== article._id.toString()) {
    res.status(400).send("This reaction can't be posted from here");
    return;
  }

  // Find if the same user has already made any reaction - example user changing like to dislike etc.
  let reaction = await Reactions.findOne({
    objectType: ObjectTypes.Comment,
    objectId: comment._id,
    userId: req.query.userId
  });

  if (reaction) {
    // MongoDB returns the whole doc metadata?
    reaction = reaction._doc || reaction;

    // If found, then we just update the existing reaction. Meaning we only allow one reaction per user
    reaction = {
      ...reaction,
      ...req.body,
      objectType: ObjectTypes.Comment,
      objectId: comment._id,
      userId: req.query.userId
    };
  } else {
    // Else create a new reaction object with the incoming info and overwrite with info pertaining to the article and user
    reaction = new Reactions({
      ...req.body,
      objectType: ObjectTypes.Comment,
      objectId: comment._id,
      userId: req.query.userId
    });
  }

  // We choose to do upsert so it can either be update or insert depending on
  // whether the user has previously created a reaction or not
  reaction = await Reactions.updateOne({ _id: reaction._id }, reaction, { upsert: true });

  // Send the resultant reaction back as the response
  res.status(200).json(reaction);
});

// Delete the reaction by the user. User Id will come in the query string parameter for now
news.delete("/:id/comments/:commentId/reactions", async (req, res) => {
  // We need user id for whom the reaction is being created or updated
  if (!req.query.userId) {
    res.status(400).send("User id should be sent in");
    return;
  }

  let result = await Reactions.deleteOne({
    objectType: ObjectTypes.Comment,
    objectId: req.params.commentId,
    userId: req.query.userId
  });
  console.log(result);

  res.sendStatus(200);
});

module.exports = news;
