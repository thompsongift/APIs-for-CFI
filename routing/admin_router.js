const express = require("express");
const routerAdmin = express.Router();

const {
  getAllStudentInfo,
  getTotalScoreQuestion,
  setStatusAdmin,
} = require("../mongoDB_functions");

routerAdmin.get("/", async (req, res) => {
  try {
    const allData = await getAllStudentInfo();
    const totalScore = await getTotalScoreQuestion();
    res.json({ allData, totalScore });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

routerAdmin.get("/setbyadmin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setStatusAdmin({ _id: id });
    res.json({ message: "Successful" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = { routerAdmin };
