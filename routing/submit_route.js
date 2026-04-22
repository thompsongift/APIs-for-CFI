const express = require("express");
const routerSubmit = express.Router();
const { examScorer } = require("../important_functions");
const { submitHandler, UpdateUserHandler } = require("../mongoDB_functions");

//const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

routerSubmit.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { submited_data } = req.body;
    const score = examScorer(submited_data);
    await submitHandler({
      _id: id,
      score: score,
      submitted: true,
      started: false,
      loggedIn: false,
    });
    res.json({ message: "Answers submitted successfully!" });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(404).json({ error: error.message });
  }
});

routerSubmit.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { updated_data, seconds } = req.body;
    await UpdateUserHandler({
      _id: id,
      updated_data: updated_data,
      time_remaining: seconds,
    });
    res.json({ message: "User updated successfully!" });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = { routerSubmit };
