/*
 *Logs (W);
 *21/01 - created index.js: server app
 *21/01 - accessed and parsed data from dataset
 *23/01 - testing output format and added error handling
 *
 *Logs (<developer's_initial>);
 *
 *
 *
 */

"use strict";

/*
 *DATA DECLARATIONS;
 */
const PORT = 8080; //port on which server will run
//required packages;
const express = require("express");
const app = express();
const axios = require("axios");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")({ sigint: true });
const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json";
let data, region = "moka";

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

//default route
app.get("/", (req, res) => {
  try {
    res.send("Hello there! I am a JSON response.");
  } catch (error) {
    console.log(error);
  }
});

//route to dataset
app.get("/dataset", async (req, res) => {
  try {
    data = await fetch_data(dataset);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
  return data;
});

//function to get user input and return data for that region
let get_region = async (_data) => {

  // region = prompt("Where do you live? ");
  console.log(`\n💡 Power outage data fetched for ${region.toUpperCase()}; \n`);
  //output data for the user defined region (3 upcomming power outages);
  for (let i = 0; i < 3; i++) {
    console.log(`\n${i+1}. 📅 ${_data[region][i].date}
        \n🗺️  ${_data[region][i].locality}, ${_data[region][i].district.toUpperCase()}
        \n🏠 ${_data[region][i].streets}
        `);
  }
};

//function to test server routes and display urls
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
    //test_server(); /* uncomment to view server details */
    //query dataset and output respective data;
    fetch_data().then((data) => get_region(data));
  } catch (error) {
    console.log(error);
  }
};

//execute application;
let popn = run();
