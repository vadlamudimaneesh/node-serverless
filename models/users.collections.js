const dynamoose = require("dynamoose");

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
});

const Users = dynamoose.model("Users", UserSchema);
module.exports = { Users };
