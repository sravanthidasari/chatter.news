"use strict";
const https = require("https");
const fetch = require("node-fetch");

async function getTopNewsFromBing() {
  const res = await fetch("https://westus2.api.cognitive.microsoft.com/bing/v7.0/news", {
    method: "GET",
    headers: { "Ocp-Apim-Subscription-Key": "4c2c58925d16403b833369d435edbe67" }
  });

  const json = await res.json();
  return json;
}

// getTopNewsFromBing().then((value) => {
//   console.log(value);
// });

module.exports = getTopNewsFromBing;
