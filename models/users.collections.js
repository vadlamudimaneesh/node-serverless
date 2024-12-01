const dynamoose = require("dynamoose");

// Define the User schema with 'create: false' to prevent automatic table creation
const UserSchema = new dynamoose.Schema({
  userId: { type: String, hashKey: true },  // Primary Key
  email: { type: String, required: true, index: { global: true } },
  status: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: Array, 
    schema: [String], 
    required: true 
  },
  firstName: String,
  lastName: String,
  gender: String,
  mobileNumber: String,
}, {
  create: false,  // Prevent Dynamoose from creating the table
  waitForActive: false // This ensures the table is not waiting to become active
});

// Create the model
const Users = dynamoose.model("Users", UserSchema);

// Ensure the table exists and synchronize the schema without creating it
async function syncTable() {
  try {
    // Check if the table exists and sync schema (without creating)
    await Users.table(); // This ensures that Dynamoose doesn't attempt to create the table if it exists
    console.log('Table synchronized and exists!');
  } catch (error) {
    console.error('Error syncing the table:', error);
  }
}

// Call syncTable() before performing operations like scan or query
syncTable();

// Export Users model
module.exports = { Users };
