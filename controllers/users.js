const { ListTablesCommand, CreateTableCommand, PutItemCommand, GetItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const DB = require("../config/db/db").dbClient;

async function createTable() {
  try {
    const params = {
      TableName: "Users",
      KeySchema: [
        { AttributeName: "UserID", KeyType: "HASH" }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: "UserID", AttributeType: "S" }, // 'S' for String
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    const data = await DB.send(new CreateTableCommand(params));
    console.log("Table created successfully:", data);
  } catch (error) {
    console.log(error);
  }
}

async function addUser() {
    try {
      // Define the item to insert
      const params = {
        TableName: "Users",
        Item: {
          "UserID": { S: "U0000" }, // 'S' indicates a String type
          "Name": { S: "Maneesh V" },
          "Email": { S: "maneeshvadlamudi@gmail.com" },
          "Age": { N: "28" } // 'N' indicates a Number type
        }
      };
  
      // Send the PutItemCommand to DynamoDB
      const data = await DB.send(new PutItemCommand(params));
      console.log("Item added successfully:", data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  async function getUser(userId) {
    try {
      const params = {
        TableName: "Users",
        Key: {
          "UserID": { S: userId } // Specify the partition key
        }
      };
  
      const data = await DB.send(new GetItemCommand(params));
      if (data.Item) {
        console.log("Retrieved item:", data.Item);
      } else {
        console.log("No item found with the specified UserID.");
      }
    } catch (error) {
      console.error("Error retrieving item:", error);
    }
  }

  async function getAllUsers() {
    try {
      const params = {
        TableName: "Users"
      };
  
      const data = await DB.send(new ScanCommand(params));
      if (data.Items && data.Items.length > 0) {
        console.log("Retrieved items:");
        data.Items.forEach(item => console.log(item));
      } else {
        console.log("No items found in the table.");
      }
    } catch (error) {
      console.error("Error scanning table:", error);
    }
  }

  module.exports = {
    createTable,
    addUser,
    getAllUsers,
    getUser
};