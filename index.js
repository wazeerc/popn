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
 *
 *
 *
 *Logs (<developer's_initial>);
 *
 *
 *
 *Known Bugs/Issues (W);
 *Error handling;
 *-wrong locality input (line 161)
 *-when no power outages found for a locality (line 236)
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

//global variables;
const dataset =
  "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json"; /* CEB dataset in JSON format by MrSunshyne - https://github.com/MrSunshyne/ */
let data,
  district,
  locality,
  localities = [],
  amt_po = 99; //amount of power outages data to query
const districts = [
  "blackriver",
  "flacq",
  "grandport",
  "moka",
  "pamplemousses",
  "plainewilhems",
  "portlouis",
  "rivieredurempart",
  "savanne",
];

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
    console.log(error);
    console.log("🚨 Error fetching data from dataset. Please try again later.");
    process.exit(1);
  }
}

//default route
app.get("/", (req, res) => {
  try {
    res.send("\n\nHello there! I am a JSON response.");
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
        console.log("\n👋 Shutting down...\n");
        process.exit(1);
      }
      userRes = userRes.replace(/\s/g, "").toLowerCase();
      userRes = userRes.replace(/[^a-zA-Z ]/g, "");
      if (!districts.includes(userRes)) {
        //check if user input made a typo
        let typo = districts.find((district) => {
          return district.includes(userRes);
        });
        if (typo) {
          console.log(`\n⚠️ Did you mean '${typo}'? Try again.\n`);
          resolve(readLineAsync_district(msg));
        } else {
          console.log(`\n❌ District not found. Try again.\n`);
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
        console.log("\n👋 Shutting down...\n");
        process.exit(1);
      }
      userRes = userRes.toLowerCase();
      userRes = userRes.replace(/[^a-zA-Z ]/g, "");
      //check if user input made a typo???
      resolve(userRes);
    });
  });
};

//function to get user inputs
let promt_po_data = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(
    `\n🗺️ Available districts: Black River, Flacq, Grand Port, Moka, Pamplemousses, Plaine Wilhems, Port Louis, Riviere du Rempart, and Savanne.\n`
  );
  //prompt user to select a district then locality
  district = await readLineAsync_district(`\n🔍 Select a district: `);
  await display_localities();
  locality = await readLineAsync_locality(`\n🔍 Select a locality: `);
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
    console.log("\n______________________________________________________");
    console.log(
      `\n\n💡 Power outage data fetched for ${
        locality.charAt(0).toUpperCase() + locality.slice(1)
      }, ${
        district.charAt(0).toUpperCase() + district.slice(1)
      } (up to ${amt_po} planned power outages); \n`
    );
    console.log("______________________________________________________");
    //output data for the user defined parameters
    new Promise((resolve) => setTimeout(resolve, 1000));
    //loop through district and return data for the locality
    for (let i = 0; i < amt_po; i++) {
      var targetLocality = _data[district][i].locality.toLowerCase();
      if (locality === targetLocality) {
        console.log(`\n📅 ${_data[district][i].date}
        \n🏙️ ${_data[district][i].locality}, ${_data[district][
          i
        ].district.toUpperCase()}
        \n🛣️ ${_data[district][i].streets}
                `);
        console.log("______________________________________________________\n");
      }
      //if no power outages found for the locality found???
      // switch (locality) {
      //   case targetLocality:
      //     console.log(
      //       `\n⚠️ No power outages found for ${
      //         locality.charAt(0).toUpperCase() + locality.slice(1)
      //       }.\n`
      //     );
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

//function to show user a guide on how to use the app
let user_guide = () => {
  try {
    console.log(
      `Hello there! I am a power outage app for Mauritius 🇲🇺.\n\n📚 User guide:
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
