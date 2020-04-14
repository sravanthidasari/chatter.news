const user = require("express").Router();

const Users = require("../models/users");

user.get("/:id", async (req, res) => {
  let u = await Users.findOne({ userId: req.params.id });
  if (!u) {
    res.sendStatus(404);
    return;
  }

  return u._doc || u;
});

user.post("/", async (req, res) => {
  u = {
    ...req.body
  };

  if (!u.userId || !u.name) {
    res.sendStatus(400);
    return;
  }

  u = await Users.create(u);
  res.status(200).json(u);
});

module.exports = user;
