require("express-async-errors");
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const morgan = require("morgan");
const mountRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler")
const connectDB = require("./src/config/dbConn")

connectDB()

const app = express();
const PORT = process.env.PORT || 5001;

 
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mountRoutes(app); 
app.use(errorHandler)

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB")
  app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`))
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); 
});