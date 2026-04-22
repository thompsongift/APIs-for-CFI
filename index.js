const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { connectToMongoDB } = require("./mongoDB_setup");
const { saveNewUser } = require("./mongoDB_functions");
const { saveToMongoDBFromExcel } = require("./excelData");
const { routerQuestions } = require("./routing/questions_route");
const { routerSubmit } = require("./routing/submit_route");
const { routerUser } = require("./routing/user_route");
const { routerAdmin } = require("./routing/admin_router");

const app = express();
const port = 3001;
const host = "0.0.0.0";

connectToMongoDB();
app.use(express.json());
app.use(express.static("dist"));
app.use("/api/question", routerQuestions);
app.use("/api/submit", routerSubmit);
app.use("/api/getuser", routerUser);
app.use("/api/examadmin", routerAdmin);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

const httpServer = http.createServer(app);

httpServer.listen(port, host, () => {
  console.log(`HTTP server running at http://${host}:${port}`);
  //saveToMongoDBFromExcel();
});
