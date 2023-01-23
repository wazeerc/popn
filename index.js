/*
 *Logs (W);
 *21/01 - created index.js: server app
 *21/01 - accessed and parsed data from dataset
 *23/01 - testing output format and added error handling
 *
 * Logs (<developer's_initial>);
 *
 *
 *
 */

"use strict";

/*
 *DATA DECLARATIONS;
 */
const PORT = 8080; // port on which server will run
//required packages;
const express = require("express");
const app = express();
const axios = require("axios");
const fetch = require("node-fetch");
const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json";
let data;

/*
 *DATA MANIPULATION;
 */
//read dataset and return as JSON
async function fetch_data() {
  const response = await fetch(dataset, {
    headers: {
      accept: "application/json",
    },
  });

  return response.json();
}

app.get("/", (req, res) => {
  try {
    res.send("Hello there! I am a JSON response.");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dataset", async (req, res) => {
  try {
    data = await fetch_data(dataset);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

let test_server = () => {
  try {
    app.listen(PORT, () =>
      console.log(
        `🚀 Server running on http://localhost:${PORT}
            \n📅 View the dataset here: http://localhost:${PORT}/dataset
        `)
    );
  } catch (error) {
    console.log(error);
  }
};

/*
 *RUN SERVER;
 */
let run = () => {
  try {
    test_server();
    fetch_data().then((data) => {
      console.log('\n💡 Data fetched from dataset: \n')
      console.log(data["blackriver"][0]); //Test output in console
    });
  } catch (error) {
    console.log(error);
  }
};

//execute;
let popn = run();
