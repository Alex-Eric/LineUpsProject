const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Lineup = require("../models/lineup.model")


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
  res.render("lineups/lineups-create");
});


router.post("/lineups/create",fileUploader.single('videoLineup'), (req, res, next) => {
  const {agent,map,attackDefense} = req.body
  Lineup.create({videoLineup:req.file.path,agent,map,attackDefense})
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
