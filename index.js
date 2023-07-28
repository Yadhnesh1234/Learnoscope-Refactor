const express = require("express");
const app = express();
const connectDb = require("./Config/db");
const videoUpload = require("./Routes/videoUpload");
const authRoutes = require("./Routes/authRoutes");

require("dotenv").config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve the uploaded profile pictures from the "uploads" folder
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoutes); //registration , login
app.use("/api/v1", videoUpload);

const PORT = process.env.PORT || 8000;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

// Database Connection
connectDb(CONNECTION_STRING);

app.listen(PORT, () => {
  console.log(`Code Profile Application listening on port ${PORT}`);
});
