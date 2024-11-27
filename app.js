require('./config/config');
require('./config/db/db');

// Import the dynamic controller loader
const loadControllers = require('./loaders/loadControllers.js');

// Load all controllers in the controllers directory
loadControllers('../controllers');



// async function createTable() {
//     try{
//         const credentials = await DB.config.credentials();
//         console.log(credentials)

//         const data = await DB.send( new ListTablesCommand({ }) )
//         console.log(data)

//     }catch(error){
//         console.log(error)
//     }
// }

// createTable()