const app = require('express').Router();
const newsApi = require('./newsApi');
const Articles = require('../models/articles.js')

app.get('/news', async (req, res) => {
  // Articles.deleteMany({}, (err) => {
  //   console.log(err);
  // });

  const apiResult = await newsApi();
  res.json(apiResult);
});

module.exports = app;
