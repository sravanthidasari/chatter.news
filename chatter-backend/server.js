const express = require("express");
const app = express();
const newsController = require("./controllers/news");
const seed = require("./controllers/seed");

const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/news";

app.use(express.json());

const whitelist = ["http://localhost:3000", "https://fathomless-sierra-68956.herokuapp.com"];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.findIndex(s => s.toLocaleLowerCase() === origin.toLocaleLowerCase())) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

mongoose.connection.on("error", err => console.log(err.message + " is Mongod not running?"));
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

app.use("/news", newsController);
app.use("/seed", seed);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Listening to port ", PORT);
});
