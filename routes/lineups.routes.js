const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Lineup = require("../models/lineup.model");
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const { route } = require("./maps.routes");

router.get("/lineups", (req, res, next) => {
  const agentFilter = req.query.agent;
  const mapFilter = req.query.map;
  const lineUpTypeFilter = req.query.lineUpType;
  let filter = {};
  if (agentFilter && mapFilter && lineUpTypeFilter) {
    filter = {
      agent: { $eq: agentFilter },
      map: { $eq: mapFilter },
      lineUpType: { $eq: lineUpTypeFilter },
    };
  }
  if (agentFilter === "all") {
    filter["agent"] = { $exists: true };
  }
  if (mapFilter === "all") {
    filter["map"] = { $exists: true };
  }
  if (lineUpTypeFilter === "all") {
    filter["lineUpType"] = { $exists: true };
  }
  let maps = [];
  let agents = [];
  Map.find()
    .then((mapsFromDB) => {
      maps = mapsFromDB;
      return Agent.find();
    })
    .then((agentsFromDB) => {
      agents = agentsFromDB;
      return Lineup.find(filter).populate("map").populate("agent").populate("creator");
    })
    .then((lineupFromDB) => {
      const data = {
        lineup: lineupFromDB,
        maps,
        agents,
      };
      lineupFromDB.forEach((element) => {
        if (
          req.session.currentUser &&
          req.session.currentUser._id == element.creator._id
        ) {
          element.loggedIn = true;
        } else {
          element.loggedIn = false;
        }
      });
      res.render("lineups/lineups", data);
    })
    .catch((error) => {
      res.send("Error to create lineups..." + error);
    });
});

router.get("/lineups/myLineups",isLoggedIn,(req,res,next)=>{
  const agentFilter = req.query.agent;
  const mapFilter = req.query.map;
  const lineUpTypeFilter = req.query.lineUpType;
  let filter = {creator: {$eq: req.session.currentUser._id}};
  if (agentFilter && mapFilter && lineUpTypeFilter) {
    filter = {
      agent: { $eq: agentFilter },
      map: { $eq: mapFilter },
      lineUpType: { $eq: lineUpTypeFilter },
    };
  }
  if (agentFilter === "all") {
    filter["agent"] = { $exists: true };
  }
  if (mapFilter === "all") {
    filter["map"] = { $exists: true };
  }
  if (lineUpTypeFilter === "all") {
    filter["lineUpType"] = { $exists: true };
  }
  let maps = [];
  let agents = [];
  Map.find()
    .then((mapsFromDB) => {
      maps = mapsFromDB;
      return Agent.find();
    })
    .then((agentsFromDB) => {
      agents = agentsFromDB;
      return Lineup.find(filter).populate("map").populate("agent").populate("creator");
    })
    .then((lineupFromDB) => {

      const data = {
        lineup: lineupFromDB,
        maps,
        agents,
      };
      lineupFromDB.forEach((element) => {
        if (
          req.session.currentUser &&
          req.session.currentUser._id == element.creator._id
        ) {
          element.loggedIn = true;
        } else {
          element.loggedIn = false;
        }
      });
      res.render("lineups/lineups", data);
    })
    .catch((error) => {
      res.send("Error to create lineups..." + error);
    });
})
//GET CREATE LINEUPS
router.get("/lineups/create", isLoggedIn, (req, res, next) => {
  let mapArray;
  Map.find()
    .then((mapsArray) => {
      mapArray = mapsArray;
      return Agent.find();
    })
    .then((agentsArray) => {
      res.render("lineups/lineups-create", {
        maps: mapArray,
        agents: agentsArray,
      });
    })
    .then((mapsArray) => {
      mapArray = mapsArray;
      return Agent.find();
    })
    .then((agentsArray) => {
      res.render("lineups/lineups-create", {
        maps: mapArray,
        agents: agentsArray,
      });
    })
    .catch((error) => {
      res.send("Error to create lineups..." + error);
    });
});

//POST CREATE LINEUPS
router.post(
  "/lineups/create",
  fileUploader.single("videoUrl"),
  (req, res, next) => {
    const { title, agent, map, lineUpType } = req.body;
    Lineup.create({ title,creator:req.session.currentUser._id, videoUrl: req.file.path, lineUpType, map, agent })
      .then(() => {
        res.redirect("/lineups");
      })
      .catch((error) => {
        res.send("Error to create lineups..." + error);
      });
  }
);

router.post(
  "/lineups/create",
  fileUploader.single("videoUrl"),
  (req, res, next) => {
    const { title, agent, map, lineUpType } = req.body;
    Lineup.create({
      title,
      creator: req.session.currentUser._id,
      videoUrl: req.file.path,
      lineUpType,
      map,
      agent,
    })
      .then(() => {
        res.redirect("/lineups");
      })
      .catch((error) => {
        res.send("Error to create lineups..." + error);
      });
  }
);

router.get("/lineups/:id", (req, res, next) => {
  Lineup.findById(req.params.id)
    .populate("map")
    .populate("agent")
    .then((lineupFromDB) => {
      const data = {
        lineup: lineupFromDB
      }
      // lineupFromDB.forEach((element) => {
        if (
          req.session.currentUser &&
          req.session.currentUser._id == lineupFromDB.creator
        ) {
          data.loggedIn = true;
        } else {
          data.loggedIn = false;
        }
      // });
      res.render("lineups/lineups-details", data);
    })
    .catch((error) => {
      res.send("Error to create lineups..." + error);
    });
});

router.get("/lineups/:id/update", isLoggedIn, (req, res, next) => {
  let maps = [];
  let agents = [];
  Map.find()
    .then((mapsFromDB) => {
      maps = mapsFromDB;
      return Agent.find();
    })
    .then((agentsFromDB) => {
      agents = agentsFromDB;
      return Lineup.findById(req.params.id).populate("agent").populate("map");
    })
    .then((lineupFromDb) => {
      res.render("lineups/lineups-update", {
        lineup: lineupFromDb,
        maps,
        agents,
      });
    })
    .catch((error) => {
      res.send("Error to show lineup..." + error);
    });
});

//POST LINEUPS UPDATE
router.post("/lineups/:id/update", (req, res, next) => {
  const { title, agent, map, lineUpType } = req.body;
  Lineup.findByIdAndUpdate(req.params.id, { title, agent, map, lineUpType })
    .then(() => {
      res.redirect("/lineups");
    })
    .catch((error) => {
      res.send("Error to update lineups..." + error);
    });
});

//POST LINEUPS DELETE
router.post("/lineups/:id/delete", (req, res, next) => {
  Lineup.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/lineups");
    })
    .catch((error) => {
      res.send("Error to update lineups..." + error);
    });
});

module.exports = router;
