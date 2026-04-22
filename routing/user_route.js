const express = require("express");
const routerUser = express.Router();
const {
  findUser,
  saveNewUser,
  logInStatusHandler,
} = require("../mongoDB_functions");

//const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

routerUser.post("/", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await findUser({ phone_number: phoneNumber });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { _id, first_name, middle_name, last_name } = user;
    const bool = await logInStatusHandler({ _id: _id });
    if (bool) {
      res.json({ _id: _id, name: `${last_name} ${first_name} ${middle_name}` });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

routerUser.get("/save", async (req, res) => {
  const newUsers = [
    {
      first_name: "Nmesoma",
      middle_name: "Victoria",
      last_name: "Ibeneme",
      phone_number: "07076888263",
      email: "abc@gmail.com",
    },
    {
      first_name: "Miracle",
      middle_name: "Ekpere",
      last_name: "Nwaoha",
      phone_number: "08136737303",
      email: "nwaohamiracle272@gmail.com",
    },
    {
      first_name: "Chikaodinaka",
      middle_name: "Francisca",
      last_name: "Nzekwe",
      phone_number: "09039908467",
      email: "nzekwechika7@gmail.com",
    },
    {
      first_name: "Somtochukwu",
      middle_name: "Divine",
      last_name: "Udoezi",
      phone_number: "08134999094",
      email: "somtoudoezi@gmail.com",
    },
    {
      first_name: "David",
      middle_name: "Enobong",
      last_name: "Udoh",
      phone_number: "08117294991",
      email: "udohd853@gmail.com",
    },
    {
      first_name: "Ambless",
      middle_name: "Onyedikachi",
      last_name: "Okore",
      phone_number: "08027144026",
      email: "amedessokore22@gmail.com",
    },
    {
      first_name: "Daniel",
      middle_name: "Edidiong",
      last_name: "Udoh",
      phone_number: "07072296283",
      email: "udohd9889@gmail.com",
    },
  ];
  //await saveNewUser(newUsers);
  res.send("saved");
});

module.exports = { routerUser };
