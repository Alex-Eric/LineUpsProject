const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/lineups", (req, res, next) => {
  res.render("lineups/lineups");
});

module.exports = router;
