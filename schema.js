const UsersTable = {
    tableName: "Users",
    schema: {
      userId: "string",
      firstName: "string",
      lastName: "string",
      email: "string",
      password: "string",
      gender: "string",
      role: "object",
      mobileNumber: "number",
    },
  };
  
  const OrdersTable = {
    tableName: "Orders",
    schema: {
      orderId: "string",
      userId: "string",
      amount: "number",
      date: "string",
    },
  };
  
  async function validator() {
      try{
  
      }catch(error){
          console.log(error)
      }
  }
  
  module.exports = {
    validator,
    UsersTable,
    OrdersTable,
  };