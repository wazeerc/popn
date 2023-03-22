/*
 *Logs (W);
 *21/01 - created index.js: server app
 *21/01 - accessed and parsed data from dataset
 *23/01 - testing output format and added error handling
 *05/02 - formatted output and refactored Run function
 *08/02 - added promts and refactored async functions
 *09/02 - added promts and restructured code
 *10/02 - retrieval of data by district and locality
 *20/02 - display of data by locality
 *28/02 - fixed issue 1a,2b,2c, removed redundant code
 *22/03 - fixed issue 1b
 *
 *
 * 
 *Logs (<developer's_initial>);
 *
 *
 *
 !Known Bugs/Issues (W);
 *Error handling;
 *1a. wrong locality input (line 161) ✅ --- fixed
 *1b. if no data is found for a locality (line 262) ✅ --- fixed
 *
 *
 *
 TODO, Additional features and functionality;
 *2a. command to go back - not available
 *2b. remove filtering for number in read locality function ✅ --- fixed
 *2c. move large lists to a new file ✅ --- fixed
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
import { createInterface } from "readline"; //readline package to read user input
import { available_districts, available_localities } from "./data.js";

//global variables;
const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json"; /* CEB dataset in JSON format by MrSunshyne - https://github.com/MrSunshyne/ */
let data,
  district,
  locality,
  localities = [],
  amt_po = 100; //amount of power outages data to query

const sep = "----------------------------------------";
const exit_msg = "\n👋 Shutting down...\n";

/*
 *SERVER;
 */
//read dataset and return as JSON
async function fetch_data() {
  try {
    const response = await fetch(dataset, {
      headers: {
        accept: "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.log("🚨 Error fetching data from dataset. Please try again later.");
    console.log(error);
    process.exit(1);
  }
}

//default route
app.get("/", (req, res) => {
  try {
    res.send("\n\nHello there! I am a JSON response 🥸.");
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

/*
 *USER INPUT;
 */
//create readline interface
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});
//create promise to read user input for district
const readLineAsync_district = (msg) => {
  return new Promise((resolve) => {
    readline.question(msg, (userRes) => {
      if (userRes === "exit") {
        console.log(exit_msg);
        process.exit(1);
      }
      userRes = userRes.replace(/\s/g, "").toLowerCase();
      userRes = userRes.replace(/[^a-zA-Z ]/g, "");
      if (!available_districts.includes(userRes)) {
        //check if user input made a typo
        let typo = available_districts.find((district) => {
          return district.includes(userRes);
        });
        if (typo) {
          console.log(`\n⚠️ Did you mean '${typo}'? Try again.\n`);
          resolve(readLineAsync_district(msg));
        } else {
          console.log("\n❌ District not found. Try again.\n");
          resolve(readLineAsync_district(msg));
        }
      }
      resolve(userRes);
    });
  });
};

//create a promise to get user input for locality
const readLineAsync_locality = async (msg) => {
  return new Promise((resolve) => {
    readline.question(msg, (userRes) => {
      if (userRes === "exit") {
        console.log(exit_msg);
        process.exit(1);
      }

      if (userRes === "back") {
        resolve(userRes);
        //restart the program
      }

      userRes = userRes.toLowerCase();
      //check if user input made a typo
      if (!available_localities.includes(userRes)) {
        let typo = available_localities.find((locality) => {
          return locality.includes(userRes);
        });
        if (typo) {
          console.log(`\n⚠️ Did you mean '${typo}'? Try again.\n`);
          resolve(readLineAsync_locality(msg));
        } else {
          console.log(`\n❌ Locality not found. Try again.\n`);
          resolve(readLineAsync_locality(msg));
        }
      }
      resolve(userRes);
    });
  });
};

//function to get user inputs
let promt_po_data = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("\n", sep);

  let districts = available_districts.map((district) => {
    return district.charAt(0).toUpperCase() + district.slice(1);
  });
  districts = districts.join(", ");
  console.log(`\n🗺️ Available districts: ${districts}.\n`);

  //prompt user to select a district then locality
  district = await readLineAsync_district(`\n📍 Select a district: `);
  await display_localities();
  locality = await readLineAsync_locality(`\n📍 Select a locality: `);
  readline.close();
  return district, locality;
};

/*
 *DATA MANIPULATION;
 */
//function to display all localities for a user defined district
let display_localities = async () => {
  try {
    let _data = await fetch_data(dataset);
    for (let i = 0; i < _data[district].length; i++) {
      localities.push(_data[district][i].locality);
    }
    localities = [...new Set(localities)];
    localities.sort();
    localities = localities.map((locality) => {
      return locality.toLowerCase();
    });
    localities = localities.map((locality) => {
      return locality.charAt(0).toUpperCase() + locality.slice(1);
    });
    localities = localities.map((locality) => {
      return locality.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    });
    console.log(`\n🏙️ Available localities: ${localities.join(", ")}\n`);
  } catch (error) {
    console.log(error);
  }
};

//function to fetch data from dataset for user defined parameters
let display_po = async (_data) => {
  try {
    let found = false; // initialize a flag to track if data was found for the locality
    console.log('\n',sep);
    //loop through district and return data for the locality
    for (let i = 0; i < amt_po; i++) {
      var targetLocality = _data[district][i].locality.toLowerCase();
      if (locality === targetLocality) {
        if (!found) {
          // print the message only if data for the locality is found
          console.log(
            `\n💡 Power outage data fetched for ${
              locality.charAt(0).toUpperCase() + locality.slice(1)
            }, ${
              district.charAt(0).toUpperCase() + district.slice(1)
            } (up to ${amt_po} planned power outages); \n`
          );
          found = true; // set the flag to true
        }
        console.log(`📅 ${_data[district][i].date}
          \n🏙️ ${_data[district][i].locality}, ${_data[district][
          i
        ].district.toUpperCase()}
          \n🛣️ ${_data[district][i].streets}
          `);
        console.log(sep);
      }
    }

    if (!found) {
      // if data for the locality is not found, display a message
      console.log(
        `\n❌ No power outage data found for ${
          locality.charAt(0).toUpperCase() + locality.slice(1)
        }.\n`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(exit_msg);
  } catch (error) {
    console.log(error);
  }
};


//function to show user a guide on how to use the app
let user_guide = () => {
  try {
    console.log(
      `Hello! I am a power outage app for Mauritius 🇲🇺.\n\n📚 User guide:
        \n1. Select a district from the list.
        \n2. The app will display the next power outages for that district.
        \n3. To exit the app, type "exit".
        \n4. To view the dataset, go to http://localhost:${PORT}/dataset.
        `
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
    user_guide();
    promt_po_data().then(() => fetch_data().then((data) => display_po(data)));
  } catch (error) {
    console.log(error);
    fs.appendFile("error.log", error, (err) => {
      if (err) throw err;
    });
  }
};

let popn = run();

//end of file;
