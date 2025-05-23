import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const { connect, connection } = mongoose;

const MONGODB_URL = process.env.MONGODB_URL;

export default () => {
  connect(MONGODB_URL);
  connection.on("error", console.error.bind("Connection Error"));
  connection.once("open", () => {
    console.log("Mongodb Connected!");
  });
};
