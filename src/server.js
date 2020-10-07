//import everything here
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

//for cross origin resource sharing
import cors from "cors";
import config from "./config";

// using env values
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Use bodyParser
import bodyParser from "body-parser";
app.use(bodyParser.json());

//---------------------------------------------------------------------
// database
const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const connection = mongoose.connection;
connection.once("open", () => console.log("database connected"));
//---------------------------------------------------------------------
//import routing here

const adminRouter = require("./routes/admin.route");
app.use("/api/admin", adminRouter);

const authRouter = require("./routes/auth.route");
app.use("/api", authRouter);

//---------------------------------------------------------------------

//Handle request here
app.get("/", (req, res) => {
  res.json({
    msg: "Counselling Backend is Up",
    isRunning: true,
  });
});

// creating server and running
app.listen(config.PORT, () =>
  console.log(`server is running at http://localhost:${config.PORT}`)
);
