const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/maps", (req, res, next) => {
  res.render("maps/maps");
});

module.exports = router;
