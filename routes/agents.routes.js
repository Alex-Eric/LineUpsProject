const express = require('express');
const router = express.Router();
const axios = require("axios")

/* GET home page */
router.get("/agents", (req, res, next) => {
    axios.get("https://valorant-api.com/v1/agents")
    .then(res=> {
        return res.data
    })
    .then(response=>{
        res.render("agents/agents",response);
    })
});


module.exports = router;
