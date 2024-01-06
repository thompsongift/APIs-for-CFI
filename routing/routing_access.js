const express = require("express");
const { apiKeyMiddleware } = require("./api_init");
const { saveToMongoDBFromExcel } = require("../excelData");
const { saveNewUser, findUser } = require("../mongoDB_functions");

const router_access = express.Router();

router_access.get("/savenew", (req, res) => {
  const carryOut = async () => {
    try {
      const username = req.query.name;
      const userphone = req.query.phonenum;
      await saveNewUser({ name: username, phoneNumber: userphone });
      res.json({
        message: `user data saved to mongoDB succesfully. Name: ${username}, Phone Number: ${userphone}`,
      });
      //res.json({ message: `Name: ${username}\nPhone Number: ${userphone}` });
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  };
  carryOut();
});

router_access.get("/find", (req, res) => {
  const carryOut = async () => {
    try {
      res.json({ message: "Excel data saved to mongoDB succesfully" });
    } catch (err) {
      console.error(err);
      res.sendStatus(404);
    }
  };
  carryOut();
});

module.exports = { router_access };
