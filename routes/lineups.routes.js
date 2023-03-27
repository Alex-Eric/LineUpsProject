const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Lineup = require("../models/lineup.model")
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");


router.get("/lineups", (req, res, next) => {
  Lineup.find()
  .then(lineupFromDB=>{
    res.render("lineups/lineups",{lineup:lineupFromDB});
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});


router.get("/lineups/create", (req, res, next) => {
  Map.find()
  .then(mapsArray=>{
    res.render("lineups/lineups-create",{maps:mapsArray});
  })
});


router.post("/lineups/create",fileUploader.single('videoLineup'), (req, res, next) => {
  const {title,agent,map,attackDefense} = req.body
  Lineup.create({videoLineup:req.file.path,title,agent,map,attackDefense})
  .then(()=>{
    res.redirect("/lineups")
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});

router.get("/lineups/:id",(req, res, next) => {
  Lineup.findById(req.params.id)
  .then(lineupFromDB=>{
    console.log(lineupFromDB)
    res.render("lineups/lineups-details",lineupFromDB);
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});

module.exports = router;
