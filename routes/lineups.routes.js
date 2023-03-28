const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Lineup = require("../models/lineup.model")
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");
const isUserLoggedIn = require("../middleware/isLoggedIn");


router.get("/lineups", (req, res, next) => {
  
  Lineup.find()
  .populate("map")
  .populate("agent")
  .then(lineupFromDB=>{
    res.render("lineups/lineups",{lineup:lineupFromDB});
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});


router.get("/lineups/create",isUserLoggedIn, (req, res, next) => {
  let mapArray
  Map.find()
  .then(mapsArray=>{
    mapArray = mapsArray
    return Agent.find()
  })
  .then(agentsArray=>{
    res.render("lineups/lineups-create",{maps:mapArray,agents:agentsArray});

  })
});


router.post("/lineups/create",fileUploader.single('videoLineup'), (req, res, next) => {
  console.log(req)
  const {title,agent,map,attackDefense} = req.body
  Lineup.create({title,videoLineup:req.file.path,attackDefense,map,agent})
  .then(()=>{
    res.redirect("/lineups")
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});

router.get("/lineups/:id",(req, res, next) => {
  Lineup.findById(req.params.id)
  .populate("map")
  .populate("agent")
  .then(lineupFromDB=>{
    res.render("lineups/lineups-details",lineupFromDB);
  })
  .catch((error) => {
    res.send("Error to create lineups..." + error)
  });
});

router.get("/lineups/:id/lineups-update"),(req,res,next)=>{
  const {title,agent,map,attackDefense} = req.params
  Lineup.findById({title,agent,map,attackDefense})
  .then(()=>{
    res.render("/lineups/lineups-update")
  })
  .catch((error) => {
    res.send("Error to update lineups..." + error)
  });
}

module.exports = router;
