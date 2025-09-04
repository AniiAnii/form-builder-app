// src/utils/waitForDb.js
const db = require('../config/db'); //Ne destrukturiraj

async function waitForDb(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await db.authenticate(); //Pozovi na `db`, ne na `sequelize`
      console.log("MySQL konekcija uspostavljena.");
      return;
    } catch (err) {
      console.log(`Pokušaj ${i+1} konekcije na bazu neuspešan:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

module.exports = waitForDb;