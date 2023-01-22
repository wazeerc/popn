/*
 *Logs:
 *21/01 - created index.js: server app
 *21/01 - accessed and parsed data from dataset
 *
 */

"use strict";

/*
 *DATA DECLARATIONS;
 */
const PORT = 8000; // port on which server will run
//required packages;
const express = require("express");
const app = express(); // instance of express app
const cheerio = require("cheerio");
const axios = require("axios");
const fetch = require("node-fetch");

const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json";
//const data = "";

/*
 *DATA MANIPULATION;
 */
//function to read dataset and return as JSON
async function fetchJSON(url) {
  const response = await fetch(dataset, {
    headers: {
      accept: "application/json",
    },
  });

  return response.json();
}

app.get("/", (req, res) => {
  res.json("Hello there! I am a JSON response.");
});

app.get("/dataset", async (req, res) => {
  let data = await fetchJSON(dataset);
  res.json(data)
  console.log(data["blackriver"]);
});

let test_server = () => {
  app.listen(PORT, () =>
    console.log(
      `🚀 Server running on http://localhost:${PORT}
            \n📅 View the dataset here: http://localhost:${PORT}/dataset
            `
    )
  );
};

/*
 *RUN SERVER;
 */
let init = () => {
  fetchJSON();
  test_server();
};

init();
