const express = require("express");
const { apiKeyMiddleware } = require("./api_init");
const { saveToMongoDBFromExcel } = require("../excelData");
const { deleteUser } = require("../mongoDB_functions");

const router_main = express.Router();

// Use the apiKeyMiddleware for all routes in this router
router_main.use(apiKeyMiddleware);

// Protected route
router_main.get("/init_xdata", (req, res) => {
  const carryOut = async () => {
    try {
      await saveToMongoDBFromExcel();
      res.json({ message: "Excel data saved to mongoDB succesfully" });
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  };
  carryOut();
});

router_main.get("/del_person", (req, res) => {
  const carryOut = async () => {
    try {
      const username = req.query.name;
      await deleteUser({ name: username });
      res.json({ message: `Successfully Deleted ${username}` });
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  };
  carryOut();
});

module.exports = { router_main };
