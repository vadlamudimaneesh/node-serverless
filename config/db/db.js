const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutItemCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',  // Default region if not provided in environment
  credentials: {
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.KEY,
  },
});

// Use DynamoDB DocumentClient to simplify working with DynamoDB items
const docClient = DynamoDBDocumentClient.from(dbClient);

module.exports = { docClient, PutItemCommand, ScanCommand };
