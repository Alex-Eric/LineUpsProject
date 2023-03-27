const mongoose = require("mongoose");
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");
const axios = require("axios");
const { response } = require("express");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LineUpsProject";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

    //return Book.deleteMany({}); //WARNING: this will delete all books in your DB !!
  })
  .then(() => {
    axios
      .get("https://valorant-api.com/v1/maps")
      .then((responseFromAPI) => {
        return responseFromAPI.data;
      })
      .then((dataFromAPI) => {
        const maps = [];
        dataFromAPI.data.forEach((element) => {
          maps.push({ name: element.displayName, image: element.splash });
        });
        return Map.insertMany(maps);
      })
      .then((mapsFromDB) => {
        console.log(`Created ${mapsFromDB.length} maps`);

        // Once created, close the DB connection
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error("Error connecting to DB: ", err);
      });
  });
