const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Lineup = require("../models/lineup.model")
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");
const isUserLoggedIn = require("../middleware/isLoggedIn");
const { route } = require('./maps.routes');



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


router.post("/lineups/create",fileUploader.single('videoUrl'), (req, res, next) => {
  const {title,agent,map,lineUpType} = req.body
  Lineup.create({title,videoUrl:req.file.path,lineUpType,map,agent})
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

router.get("/lineups/:id/update",(req, res, next)=>{
  let maps = []
  let agents = []
  Map.find()
  .then((mapsFromDB)=>{
    maps = mapsFromDB
    return Agent.find()
  })
  .then((agentsFromDB)=>{
    agents = agentsFromDB
    return Lineup.findById(req.params.id)
  })
 .then((lineupFromDb)=>{
  res.render("lineups/lineups-update", {lineup: lineupFromDb,maps,agents} )
 })
 .catch((error) => {
  res.send("Error to show lineup..." + error)
});
})


router.post("/lineups/:id/update",(req,res,next)=>{
  const {title,agent,map,lineUpType} = req.body
  Lineup.findByIdAndUpdate(req.params.id, {title,agent,map,lineUpType})
  .then(()=>{
    res.redirect("/lineups")
  })
  .catch((error) => {
    res.send("Error to update lineups..." + error)
  });
})

module.exports = router;
