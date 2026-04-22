const express = require("express");
const routerQuestions = express.Router();
const {
  getAllQuestion,
  getStatus,
  setStatus,
  setMalpractice,
} = require("../mongoDB_functions");

//const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

routerQuestions.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { started, time_remaining, malpractice } = await getStatus({
      _id: id,
    });
    let questions = await getAllQuestion({ _id: id });
    if (!questions) {
      return questions.status(404).json({ error: "Questions not found" });
    }
    // if (malpractice) {
    //   return questions.status(404).json({
    //     error: "User banned",
    //   });
    // }

    const sentQuestion = questions;
    res.json({ sentQuestion, started, time_remaining });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

routerQuestions.get("/started/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setStatus({ _id: id });
    res.json({ message: "Successful" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

routerQuestions.get("/malpractice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setMalpractice({ _id: id });
    res.json({ message: "Successful" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

routerQuestions.post("/malpractice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setMalpractice({ _id: id });
    res.json({ message: "Successful" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = { routerQuestions };
