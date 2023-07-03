require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB;

async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = main;
