const userController = require("../controllers/users");

async function getUser(event) {
  try {
    const getUser = await userController.getUser(event);
    return { 
      statusCode: getUser.code, 
      body: JSON.stringify(getUser) 
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
    const userData = await userController.createUser(event);
    return { 
      statusCode: userData.code, 
      body: JSON.stringify(userData) 
    };
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

async function deleteUser(event) {
  try {
    const userData = await userController.deleteUser(event);
    return { 
      statusCode: userData.code, 
      body: JSON.stringify(userData) 
    };
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
  getUser,
  createUser,
  deleteUser,
};
