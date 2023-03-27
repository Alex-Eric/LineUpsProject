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
  })
  .then(() => {
    return axios.get("https://valorant-api.com/v1/maps");
  })
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
  })
  .then(() => {
    return axios.get("https://valorant-api.com/v1/agents");
  })
  .then((responseFromAPI) => {
    return responseFromAPI.data;
  })
  .then((dataFromAPI) => {
    const agents = [];
    dataFromAPI.data.forEach((element) => {
      if(element.isPlayableCharacter){
        agents.push({
          name: element.displayName,
          image: element.displayIcon,
        });
      }
    });
    return Agent.insertMany(agents);
  })
  .then((agentsFromDB) => {
    console.log(`Created ${agentsFromDB.length} agents`);
    mongoose.connection.close();
  })

  // Once created, close the DB connection

  .catch((err) => {
    console.error("Error connecting to DB: ", err)
  });
