const mongoose = require("mongoose");

const connString = process.env.DATABASE_CONNECTION;
const connectDB = async () => {
  try {
    await mongoose.connect(connString);
    console.log("mongoDB connection success");
  } catch (error) {
    console.log("connection failed");
    console.log(error);
  }
};

module.exports = connectDB;
