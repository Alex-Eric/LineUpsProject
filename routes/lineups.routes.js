const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const Lineup = require("../models/lineups.model")


router.get("/lineups", (req, res, next) => {
  res.render("lineups/lineups");
});


router.get("/lineups/create", (req, res, next) => {
  res.render("lineups/lineups-create");
});


router.post("/lineups/create",fileUploader.single('video-lineup'), (req, res, next) => {
  const {agent,map,attackDefense} = req.body
  Lineup.create({video:req.file.path,agent,map,attackDefense})
  .then(()=>{
    res.redirect("/lineups")
  })
  .catch((error) => {
    console.log("Error to create lineups..." + error);
  });
});

module.exports = router;
