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
    res.status(404);
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
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  let reactions = await Reactions.find({ objectType: ObjectTypes.Article, objectId: article.id });
  res.status(200).json(reactions);
});

// Create reaction route
news.post("/:id/reactions", async (req, res) => {
  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  // Find if the same user has already made any reaction - example user changing like to dislike etc.
  let reaction = await Reactions.findOne({ objectType: ObjectTypes.Article, objectId: article.id, userId: req.query.userId });
  if (reaction) {
    // If found, then we just update the existing reaction. Meaning we only allow one reaction per user
    reaction = {
      ...reaction,
      ...req.body,
      objectType: ObjectTypes.Article,
      objectId: article.id,
      userId: req.query.userId
    };
  } else {
    // Else create a new reaction object with the incoming info and overwrite with info pertaining to the article and user
    reaction = {
      ...req.body,
      objectType: ObjectTypes.Article,
      objectId: article.id,
      userId: req.query.userId
    };
  }

  // We choose to do upsert so it can either be update or insert depending on
  // whether the user has previously created a reaction or not
  reaction = await Reactions.updateOne({ objectType: ObjectTypes.Article, objectId: article.id, userId: req.query.userId }, reaction, {
    upsert: true
  });

  // Send the resultant reaction back as the response
  res.status(200).json(reaction);
});

// Delete the reaction by the user. User Id will come in the query string parameter for now
news.delete("/:id/reactions", async (req, res) => {
  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  // Find if the same user has already made any reaction - example user changing like to dislike etc.
  await Reactions.deleteOne({ objectType: ObjectTypes.Article, objectId: article.id, userId: req.query.userId });
  res.status(200);
});

// Get article comments
news.get("/:id/comments", async (req, res) => {
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    res.status(404);
    return;
  }
 
  // MongoDB returns the whole doc metadata?
  article = article._doc || article;
  comments = [comments]

  let comments = await Comments.find({ commentsId: article.id });
  res.status(200).json(comments);
});

//Post article comments
news.post("/:id/comments", async (req, res) => {
  let comments = [];
  // Find the article for which the comment is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  let newComment = await comments.push({ commentsId: article._id });
  res.status(200);
  res.redirect(comments);
});

//Delete article comments
news.delete("/:id/comments", async (req, res) => {
  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;
  comments= [comments];

  await comments.splice({ articleId: article._id });
  res.status(200).json(comments);
});

//Edit artcile comments
news.put("/:id/comments", async (req, res) => {
  // Find the article for which the reaction is being made
  let article = await Articles.findOne({ _id: req.params.id });
  if (!article) {
    // If article not found, return 404 status
    res.status(404);
    return;
  }

  // MongoDB returns the whole doc metadata?
  article = article._doc || article;

  await Comments.editComments({ Id: article._id });
  res.status(200).json(comments);
});

module.exports = news;
