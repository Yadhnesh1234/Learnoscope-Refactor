const mongoose = require("mongoose");

const connectDb = (CONNECTION_STRING) => {
  mongoose
    .connect(CONNECTION_STRING)
    .then((conn) => {
      console.log(`DB connection successfull on link : ${CONNECTION_STRING}`);
    })
    .catch((err) => {
      console.log("some error occured", err);
    });
};

module.exports = connectDb;
