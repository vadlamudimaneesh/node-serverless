const userController = require("../controllers/users");


async function getAllUsers() {
  try {
    const allUsers = await userController.getAllUsers();

    return { MSG : JSON.stringify({ allUsers }) }
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
    const userData = await userController.createUser(event);
    return { body : JSON.stringify(userData) }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create users.",
        details: error.message,
      }),
    };
  }
}



module.exports = {
  getAllUsers,
  createUser
};
