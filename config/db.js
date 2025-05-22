import mongoose from "mongoose";

const { connect, connection } = mongoose;

export default () => {
  connect("mongodb://localhost:27017/recipe_app_db");
  connection.on("error", console.error.bind("Connection Error"));
  connection.once("open", () => {
    console.log("Mongodb Connected!");
  });
};
