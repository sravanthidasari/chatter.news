const news = require("express").Router();
const Articles = require("../models/articles.js");
const getTopNewsFromBing = require("./newsApi.js");

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

// Create route
news.post("/", async (req, res) => {
  Articles.create(req.body, (error, createdArticle) => {
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).send(createdArticle);
    }
  });
});

// Delete route
news.delete("/:id", (req, res) => {
  Articles.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(deletedArticle);
    }
  });
});

// Update route
news.put("/:id", (req, res) => {
  Articles.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedArticle) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(deletedArticle);
    }
  });
});

module.exports = news;
