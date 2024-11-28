const {
  ListTablesCommand,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { docClient } = require("../config/db/db");
const { Users } = require("../models/users.collections");
const { v1: uuidv1 } = require("uuid");

async function getAllUsers() {
  try {
    // Define the scan parameters
    const params = {
      TableName: process.env.USERS_TABLE,  // Reference to the table name in environment variables
    };

    // Perform the scan operation using the DocumentClient
    const data = await docClient.send(new ScanCommand(params));

    // If data is found, return success response
    if (data.Items && data.Items.length > 0) {
      return {
        code: 200,
        status: "success",
        data: {
          message: "Users List fetched successfully",
          usersList: data.Items,  // Items from the scan response
        },
      };
    } else {
      return {
        code: 404,
        status: "error",
        data: {
          message: "No users found",
        },
      };
    }
  } catch (error) {
    console.error("Error scanning table:", error);
    return {
      code: 500,
      status: "error",
      data: {
        message: "Failed to retrieve users list!!",
        details: error.message,  // Include error message in the response
      },
    };
  }
}

async function createUser(event) {
  try {
    console.log(process.env.USER, "------------ environment");

    let body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    // Check if user already exists using a scan query
    const params = {
      TableName: process.env.USERS_TABLE,
      FilterExpression: "email = :email",  // Filter expression to check for email
      ExpressionAttributeValues: {
        ":email": body.email,
      },
    };

    // Perform the scan operation to check if the user already exists
    const existingUser = await docClient.send(new ScanCommand(params));
    console.log(existingUser, "-----------> existing user check");

    if (existingUser.Items && existingUser.Items.length > 0) {
      let response = {
        code: 400,
        status: "failed",
        data: {
          message: "User already exists",
          userData: existingUser.Items,
        },
      };
      return response;
    } else {
      // Create new user object
      const newUser = {
        userId: uuidv1(),
        email: body.email,
        status: "active",
        password: body.password,
        role: [body.role],
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        mobileNumber: body.mobileNumber,
      };

      // Put new user into DynamoDB
      const putParams = {
        TableName: process.env.USERS_TABLE,
        Item: newUser,
      };

      // Perform the put operation to save the new user
      await docClient.send(new PutItemCommand(putParams));
      console.log("------------> saved", newUser);

      let response = {
        code: 200,
        status: "success",
        data: {
          message: "User created successfully",
          userData: newUser,
        },
      };
      return response;
    }
  } catch (error) {
    console.log(error);
    let response = {
      code: 500,
      status: "error",
      data: {
        message: "Failed to retrieve users.",
        details: error.message,
      },
    };
    return response;
  }
}


module.exports = {
  createUser,
  getAllUsers
};
