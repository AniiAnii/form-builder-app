const { sequelize } = require('../config/db'); 

 

async function waitForDb(retries = 5, delay = 3000) { 

  for (let i = 0; i < retries; i++) { 

    try { 

      await sequelize.authenticate(); 

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