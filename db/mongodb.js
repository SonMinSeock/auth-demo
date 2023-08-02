const mongoose = require("mongoose");

// mongoDB 연결 작업
const mongoDBConnect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/loginDemo")
    .then(() => console.log("Mongo Connection Open ✅"))
    .catch((err) => console.log("Mongo connecting Error : ", err));
};

module.exports = mongoDBConnect;
