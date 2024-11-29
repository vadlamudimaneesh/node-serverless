const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const dotenv = require("dotenv");
dotenv.config();

const dbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    // credentials: {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // }
  });

  module.exports = { dbClient };