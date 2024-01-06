const mongoose = require("mongoose");
const express = require("express");
const https = require("https");
const { promises: fsPromises, readFileSync } = require("fs");
const app = express();
const credentials = {
  key: readFileSync("private.key"),
  cert: readFileSync("certificate.crt"),
};
const httpsServer = https.createServer(credentials, app);
const { router_main } = require("./routing/routing_main");
const { router_access } = require("./routing/routing_access");
const { followUpData } = require("./mongooseSchema");
const { connectToMongoDB } = require("./mongoDB_setup");
connectToMongoDB();
app.use(express.json());

let port = 3000;

// initialize the database

app.use("/api", router_main);
app.use("/api_ctrl", router_access);

app.get("/data", (req, res) => {
  res.send("connected");
});

httpsServer.listen(process.env.PORT || port, () => {
  console.log(`HTTPS server running on ${port}`);
});

/*
APIs

curl --insecure -H "x-api-key: e8c65c0d-e231-4294-9115-85d77c33140d" https://localhost:3000/api/init_xdata
curl --insecure -H "x-api-key: e8c65c0d-e231-4294-9115-85d77c33140d" https://localhost:3000/api/del_person?name=Thompson
curl --insecure "https://localhost:3000/api_ctrl/savenew?name=<name>&phonenum=<phonenumber>"

curl --insecure "https://localhost:3000/api_ctrl/savenew?name=GiftThompson&phonenum=09154045167"


*/
