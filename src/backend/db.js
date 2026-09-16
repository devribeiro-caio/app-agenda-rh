const mongoose = require("mongoose");
const { mongoUri } = require("./config");

async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB conectado");
}

module.exports = connectDatabase;
