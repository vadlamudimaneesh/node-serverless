const dynamoose = require("dynamoose");
require("dotenv").config();  // Load environment variables

// Configure AWS credentials for Dynamoose
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION,
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Set Dynamoose to use the AWS SDK
dynamoose.aws.sdk = AWS;

module.exports = dynamoose;  // Export the configured dynamoose instance
