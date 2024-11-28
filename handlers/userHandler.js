const userController = require("../controllers/users");


async function getAllUsers() {
  try {
    console.log( "------------6")
    const allUsers = await userController.getAllUsers();
    console.log(allUsers, "_-------------> 7");
    return {
      statusCode: 200,
      body: JSON.stringify({ allUsers }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve users.",
        details: error.message,
      }),
    };
  }
}

async function createUser(event) {
  try {
    // console.log(event, "------------6")
    const userData = await userController.createUser(event);
    console.log(userData, "_-------------> 7");
    return {
      statusCode: 200,
      body: JSON.stringify({ userData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve users.",
        details: error.message,
      }),
    };
  }
}



module.exports = {
  getAllUsers,
  createUser
};
