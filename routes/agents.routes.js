const express = require('express');
const router = express.Router();
const axios = require("axios")

/* GET home page */
router.get("/agents", (req, res, next) => {
    axios.get("https://valorant-api.com/v1/agents")
    .then(responseFromAPI=> {
        console.log(responseFromAPI.data)
        res.render("agents/agents",responseFromAPI.data);
    })
    .catch(error=>{
        console.log("Error...: ",error)
        next()
    })
});

router.get("/agents/:id", (req,res,next)=>{
    axios.get(`https://valorant-api.com/v1/agents/${req.params.id}`)
    .then(responseFromAPI=>{
        res.render("agents/agents-detail",responseFromAPI.data);
    })
    .catch(error=>{
        console.log("Error...: ",error)
        next()
    })
})

module.exports = router;
