/*
 *Logs (W);
 *21/01 - created index.js: server app
 *21/01 - accessed and parsed data from dataset
 *23/01 - testing output format and added error handling
 *05/02 - formatted output and refactored Run function
 *08/02 - added promts and refactored async functions
 *09/02 - added details to promts
 *
 *Logs (<developer's_initial>);
 *
 *
 *
 */

/* enable strict mode for better error handling and security (ES6)
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode 
*/
"use strict";

/*
 *DATA DECLARATIONS;
 */
const PORT = 8080; //port on which server will run
//required packages;
import express from "express";
const app = express();
import fetch from "node-fetch";
import { createInterface } from "readline";

//global variables;
const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json"; /* CEB dataset in JSON format by MrSunshyne 
  - https://github.com/MrSunshyne/ */
let data, region;
const districts = [
  "blackriver",
  "flacq",
  "grandport",
  "moka",
  "pamplemousses",
  "plaineswilhems",
  "portlouis",
  "rivieredurempart",
  "savanne",
];

/*
 *READ USER INPUT;
 */
//create readline interface
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});
//create promise to read user input
const readLineAsync = (msg) => {
  return new Promise((resolve) => {
    readline.question(msg, (userRes) => {
      //exit if user types "exit"
      if (userRes === "exit") process.exit(0);
      //if user input is not a known district, ask again
      if (!districts.includes(userRes)) {
        console.log(`\n❌ District '${userRes}' not found. Try again.\n`);
        resolve(readLineAsync(msg));
      }
      resolve(userRes);
    });
  });
};

//get user input and return as string
let get_region = async () => {
  console.log(
    `\n🗺️ Available districts: Black River, Flacq, Grand Port, Moka, Pamplemousses, Plaines Wilhems, Port Louis, Riviere du Rempart, and Savanne.\n`
  );
  region = await readLineAsync(`\n🔍 Select a district (without spaces): `);
  readline.close();
  return region;
};

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
let get_region_po = async (_data) => {
  try {
    console.log(
      `\n💡 Power outage data fetched for ${
        region.charAt(0).toUpperCase() + region.slice(1)
      }; \n`
    );
    //output data for the user defined region (3 upcomming power outages);
    for (let i = 0; i < 3; i++) {
      console.log(`\n${i + 1}. 📅 ${_data[region][i].date}
        \n🏙️ ${_data[region][i].locality}, ${_data[region][
        i
      ].district.toUpperCase()}
        \n🛣️ ${_data[region][i].streets}
                `);
    }
  } catch (error) {
    console.log(error);
  }
};

//function to test server routes and display urls
let test_server = () => {
  try {
    app.listen(PORT, () =>
      //display server details
      console.log(
        `🚀 Server running on http://localhost:${PORT}
            \n📅 View the dataset here: http://localhost:${PORT}/dataset
        `
      )
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
    //get user input then fetch data and get power outage data for that region;
    get_region().then(() => fetch_data().then((data) => get_region_po(data)));
    //query dataset and output respective data;
  } catch (error) {
    console.log(error);
  }
};

//execute application;
let popn = run();

//end of file;
