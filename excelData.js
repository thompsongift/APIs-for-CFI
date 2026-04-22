const fs = require("fs");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const { candidateQuestion } = require("./mongooseSchema");
const { MongoClient } = require("mongodb");

const parseExcelData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet(1);
  const excelData = [];

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    let options = [];
    for (let i = 2; i < 6; i++) {
      const optionText = row.getCell(i).value;
      if (optionText) {
        options.push({
          option_text: optionText,
          is_correct: row.getCell(6).value + 1 == i ? true : false,
        });
      }
    }
    let is_Mcq = row.getCell(8).value === "Yes" ? true : false;

    excelData.push({
      question_text: row.getCell(1).value,
      options: options,
      is_mcq: is_Mcq,
      answer_text: row.getCell(7).value,
    });
  });
  return excelData;
};

saveToMongoDBFromExcel = async () => {
  filePath =
    "C:/Users/USER/Documents/CFI Word College Exam/documents/questions_with_options.xlsx";
  try {
    // Parse the Excel file
    const excelData = await parseExcelData(filePath);

    // Specify the database

    // Use listCollections to retrieve information about collections in the database

    // Check if the collection with the specified name exists

    // Save data to MongoDB using Mongoose
    const client = new MongoClient("mongodb://127.0.0.1:27017/");
    const database = client.db("test");
    const collection = database.collection("questions");
    const collections = await database
      .listCollections({ name: "questions" })
      .toArray();
    if (collections.length > 0) {
      await collection.drop();
    }

    await candidateQuestion.insertMany(excelData, { ordered: false });
    console.log("Excel data saved to MongoDB successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { saveToMongoDBFromExcel };
