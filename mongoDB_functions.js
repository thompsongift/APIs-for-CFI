const { followUpData } = require("./mongooseSchema");

const saveNewUser = async (newAccount) => {
  try {
    const savedUser = await followUpData.create(newAccount);
    console.log("Users saved successfully!", savedUser);
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// finds a user from the data base
const findUser = async (Parameter) => {
  try {
    const account = await followUpData.find(Parameter).exec();
    if (account) {
      console.log(account);
    }
  } catch {
    console.error("Error finding user:", error);
  }
};

//update user information
const updateUser = async (Parameter, num) => {
  try {
    await followUpData
      .updateOne(Parameter, { $set: { numberOfPurchase: num } })
      .exec();
    console.log("update successful");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

//delete user information
const deleteUser = async (Parameter) => {
  try {
    await followUpData.deleteOne(Parameter).exec();
    console.log("removal successful");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

module.exports = {
  saveNewUser,
  findUser,
  updateUser,
  deleteUser,
};
