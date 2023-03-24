const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/maps", (req, res, next) => {
  axios.get("https://valorant-api.com/v1/maps")
    .then(responseFromApi => {
      console.log(res.data);
      res.render("maps/maps", responseFromApi.data);
    })
    .catch((error) => {
      console.log("Error to render Maps..." + error);
    });
});

module.exports = router;
