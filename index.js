// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

//This function gets all the user data by combing info from multiple "databaseds"
function getUserData(id) {
  //Map of database names to actual functions
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };

  // Return a Promise (This way the caller can .then or await it)
  return new Promise(async (resolve, reject) => {
    //Validate input:
    if (typeof id !== "number") {
      return reject(new Error("Invalid ID: must be a number"));
    }

    if (id < 1 || id > 10) {
      return reject(new Error("Invalid ID: must be between 1 and 10"));
    }

    try {
      // Figure out which database (db1, db2, db3) contains the business info
      const dbName = await central(id); // Example: returns db1

      //Use returned dbName to call the correct fucntion from the dbs
      const businessData = await dbs[dbName](id); //Includes username, website, company

      //Get personal data (name, email, address, phone)
      const personalData = await vault(id);

      //Combine personal and business data into one user user object
      const fullUser = {
        id: id,
        name: personalData.name,
        username: businessData.username,
        email: personalData.email,
        address: personalData.address,
        phone: personalData.phone,
        website: businessData.website,
        company: businessData.company,
      };

      //Return
      resolve(fullUser);
    } catch (error) {
      //If any part fails it gets caught and returns error
      reject(new Error(`Data retrieval failed: ${error.message}`));
    }
  });
}
getUserData(6)
  .then((user) => console.log("User Data:", user))
  .catch((error) => console.error("Error:", error.message));

  

central(1)
  .then((res) => console.log("central returned:", res))
  .catch((err) => console.error("Error:", err.message));
