const mongoose = require("mongoose");

const mongoDB = "mongodb://127.0.0.1:27017";

const mongoDB_url =
  "mongodb+srv://CFI:EMPSpZQkcFE27tFh@dataset.mnorfmf.mongodb.net/?retryWrites=true&w=majority";

const connectToMongoDB = () => {
  mongoose.connect(mongoDB);
  const connection = mongoose.connection;
  connection.on("error", console.error.bind(console, "connection error:"));
  connection.once("open", () => {
    console.log("Successfully connected to MongoDB");
  });
};

module.exports = { connectToMongoDB };
