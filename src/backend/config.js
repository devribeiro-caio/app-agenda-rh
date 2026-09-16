require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3333,
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://helpdeskformis:55Wformis3568@cluster0.yyf0tok.mongodb.net/?appName=Cluster0"
};
