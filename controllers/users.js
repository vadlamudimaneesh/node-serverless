const {
  ListTablesCommand,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const DB = require("../config/db/db").dbClient;
const { Users } = require("../models/users.collections");
const { v1: uuidv1 } = require("uuid");

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

async function createUser(event) {
  try {
    console.log(process.env.USER, "------------ environment")
    let body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const existingUser = await Users.scan("email").eq(body.email).exec();
    console.log(existingUser,"-----------> 58");
    if (existingUser.count > 0) {
      let response = {
        code : 400,
        status : "failed",
        data : {
          message : "User already exists",
          userData : existingUser
        }
      }
      return response;
    } else {
      const newUser = new Users({
        userId: uuidv1(),
        email: body.email,
        status: "active",
        password: body.password,
        role: [body.role],
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        mobileNumber: body.mobileNumber,
      });
      let savedUser = await newUser.save()
      console.log(savedUser, "------------> saved")
      if(savedUser.email == newUser.email){
        let response = {
          code : 200,
          status : "success",
          data : {
            message : "User created successfully",
            userData : savedUser
          }
        }
        return response;
      }else {
        let response = {
          code : 400,
          status : "error",
          data : {
            message : "Failed to save the user"
          }
        }
        return response;
      }
    }
  } catch (error) {
    console.log(error);
    let response = {
      code : 500,
      status : "error",
      data : {
        message : "Failed to retrieve users.",
        details : error.message
      }
    }
    return response;
  }
}

async function getUser(event) {
  try {
    const params = {
      TableName: "Users",
      Key: {
        UserID: { S: userId }, // Specify the partition key
      },
    };

    const data = await DB.send(new GetItemCommand(params));
    console.log(data, "--------63");
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
    const usersList = await Users.scan().exec()
    console.log(usersList)
    if(usersList.count >= 0){
      let response = {
        code : 200,
        status : "success",
        data : {
          message : "UsersList fetched successfully",
          usersList : usersList
        }
      }
      return response;
    }
  } catch (error) {
    console.error("Error scanning table:", error);
    let response = {
      code : 500,
      status : "error",
      data : {
        message : "Failed to retrieve users list!!",
        details : error.name
      }
    }
    return response;
  }
}

module.exports = {
  createTable,
  createUser,
  getAllUsers,
  getUser,
};
