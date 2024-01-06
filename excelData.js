const fs = require("fs");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const { followUpData } = require("./mongooseSchema");
const { MongoClient } = require("mongodb");

const parseExcelData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet(1);
  const excelData = [];

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const rowData = {
      name: row.getCell(1).value,
      phoneNumber: row.getCell(2).value,
    };

    excelData.push(rowData);
  });
  return excelData;
};

saveToMongoDBFromExcel = async () => {
  filePath = "C:/Users/USER/OneDrive/Documents/Soul Winning Campaign.xlsx";
  try {
    // Parse the Excel file
    const excelData = await parseExcelData(filePath);

    // Specify the database

    // Use listCollections to retrieve information about collections in the database

    // Check if the collection with the specified name exists

    // Save data to MongoDB using Mongoose
    const client = new MongoClient("mongodb://127.0.0.1:27017/Follow_up");
    const database = client.db("Follow_up");
    const collection = database.collection("datas");
    const collections = await database
      .listCollections({ name: "datas" })
      .toArray();
    if (collections.length > 0) {
      await collection.drop();
    }

    await followUpData.create(excelData);
    console.log("Excel data saved to MongoDB successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { saveToMongoDBFromExcel };
