const {
  ListTablesCommand,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");
const { dbClient } = require("../config/db/db");
const { v1: uuidv1 } = require("uuid");
const schema = require("../schema");

async function tableChecker(tableName) {
  const describeCommand = new DescribeTableCommand({
    TableName: tableName,
  });
  try {
    let isTableCreated = await dbClient.send(describeCommand);
    if (isTableCreated.Table.TableStatus === "ACTIVE") {
      console.log("Table is already created and active", isTableCreated);
      return true;
    }

    if (isTableCreated.Table.TableStatus === "CREATING") {
      console.log(
        "Table is being created. Waiting for the table to become ACTIVE..."
      );
      while (isTableCreated.Table.TableStatus !== "ACTIVE") {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
        isTableCreated = await dbClient.send(describeCommand);
      }
      console.log("Table is now ACTIVE and ready for operations");
      return true;
    }
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      console.log("Table does not exist. Creating table...");
      const params = {
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
      };
      const createCommand = new CreateTableCommand(params);
      const data = await dbClient.send(createCommand);
      console.log("Table creation initiated:", data);

      // Now wait for table to become ACTIVE
      let isTableCreated = await dbClient.send(describeCommand);
      while (isTableCreated.Table.TableStatus !== "ACTIVE") {
        console.log("Waiting for table to become ACTIVE...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
        isTableCreated = await dbClient.send(describeCommand);
      }
      console.log("Table is now ACTIVE and ready for operations");
      return true;
    }
    throw error;
  }
}

async function createUser(event) {
  try {
    let tableName = schema.UsersTable.tableName;
    await tableChecker(tableName);
    let body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const params = {
      TableName: tableName,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: body.email },
      },
    };
    let existingUser;
    existingUser = await dbClient.send(new ScanCommand(params));

    if (existingUser.Items && existingUser.Items.length > 0) {
      let response = {
        code: 400,
        status: "failed",
        data: {
          message: "User already exists",
          userData: existingUser.Items,
        },
      };
      console.log(response)
      return response;
    } else {
      // Create new user object
      const newUser = {
        userId: { S: uuidv1() },
        email: { S: body.email },
        status: { S: "active" },
        password: { S: body.password },
        role: { L: [{ S: body.role }] },
        firstName: { S: body.firstName },
        lastName: { S: body.lastName },
        gender: { S: body.gender },
        mobileNumber: { S: body.mobileNumber },
      };

      const putParams = {
        TableName: tableName,
        Item: newUser,
      };
      await dbClient.send(new PutItemCommand(putParams));
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
  }
  return;
}

module.exports = {
  createUser,
};
