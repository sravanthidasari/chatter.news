const app = require("express").Router();
const newsApi = require("./newsApi");
const Articles = require("../models/articles.js");
const Reactions = require("../models/reactions");

// app.get("/news", async (req, res) => {
//   // Articles.deleteMany({}, (err) => {
//   //   console.log(err);
//   // });

//   // Test the bing news API
//   const apiResult = await newsApi();
//   res.json(apiResult);
// });

// app.get("/reactions", async (req, res) => {
//   const reactions = await Reactions.find();
//   res.json(reactions);
// });

module.exports = app;
