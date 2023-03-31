const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Lineup = require("../models/Lineup.model");
const Map = require("../models/Map.model");
const Agent = require("../models/Agent.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/lineups", (req, res, next) => {
  const agentFilter = req.query.agent;
  const mapFilter = req.query.map;
  const lineUpTypeFilter = req.query.lineUpType;
  let filter = {};
  console.log(req.query);
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
    .sort({ name: 1 })
    .then((mapsFromDB) => {
      maps = mapsFromDB;
      return Agent.find().sort({ name: 1 });
    })
    .then((agentsFromDB) => {
      agents = agentsFromDB;
      switch (req.query.sort) {
        case "ratingSort":
          return Lineup.find(filter)
            .sort({ ranking: -1 })
            .populate("map")
            .populate("agent")
            .populate("creator");
          break;
        case "agentsSort":
          return Lineup.find(filter)
            .sort({ agent: 1 })
            .populate("map")
            .populate("agent")
            .populate("creator");
          break;
        case "mapsSort":
          return Lineup.find(filter)
            .sort({ maps: -1 })
            .populate("map")
            .populate("agent")
            .populate("creator");
          break;
        case "lineupTypeSort":
          return Lineup.find(filter)
            .sort({ lineUpType: -1 })
            .populate("map")
            .populate("agent")
            .populate("creator");
          break;
        default:
          return Lineup.find(filter)
            .populate("map")
            .populate("agent")
            .populate("creator");
          break;
      }
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

router.get("/lineups/myLineups", isLoggedIn, (req, res, next) => {
  const agentFilter = req.query.agent;
  const mapFilter = req.query.map;
  const lineUpTypeFilter = req.query.lineUpType;
  let filter = { creator: { $eq: req.session.currentUser._id } };
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
      return Lineup.find(filter)
        .populate("map")
        .populate("agent")
        .populate("creator");
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
//GET CREATE LINEUPS
router.get("/lineups/create", isLoggedIn, (req, res, next) => {
  let mapArray;
  Map.find()
    .sort({ name: 1 })
    .then((mapsArray) => {
      mapArray = mapsArray;
      return Agent.find().sort({ name: 1 });
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
    let mapArray;
    Map.find()
      .sort({ name: 1 })
      .then((mapsArray) => {
        mapArray = mapsArray;
        return Agent.find().sort({ name: 1 });
      })
      .then((agentsArray) => {
        if (title === "" || req.file === undefined) {
          res.status(400).render("lineups/lineups-create", {
            errorMessage:
              "All fields are mandatory. Please provide title and video.",
            maps: mapArray,
            agents: agentsArray,
          });
        } else {
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
      });
  }
);

router.post("/rankingup/:id", isLoggedIn, (req, res, next) => {
  Lineup.findById(req.params.id)
    .then((lineupFromDB) => {
      const rankingFromDB = lineupFromDB.ranking;
      const userVotedArray = lineupFromDB.userVoted;
      if (!lineupFromDB.userVoted.includes(req.session.currentUser._id)) {
        userVotedArray.push(req.session.currentUser._id);
        return lineupFromDB.updateOne({
          ranking: rankingFromDB + 1,
          userVoted: userVotedArray,
        });
      }
    })
    .then(() => {
      res.redirect("/lineups");
    })
    .catch((error) => {
      res.send("Error to ranking..." + error);
    });
});

router.post("/rankingdown/:id", isLoggedIn, (req, res, next) => {
  Lineup.findById(req.params.id)
    .then((lineupFromDB) => {
      const rankingFromDB = lineupFromDB.ranking;
      const userVotedArray = lineupFromDB.userVoted;
      if (lineupFromDB.userVoted.includes(req.session.currentUser._id)) {
        const index = userVotedArray.indexOf(req.session.currentUser._id);
        userVotedArray.splice(index, 1);
        return lineupFromDB.updateOne({
          ranking: rankingFromDB - 1,
          userVoted: userVotedArray,
        });
      }
    })
    .then(() => {
      res.redirect("/lineups");
    })
    .catch((error) => {
      res.send("Error to ranking..." + error);
    });
});

router.get("/lineups/:id", (req, res, next) => {
  Lineup.findById(req.params.id)
    .populate("map")
    .populate("agent")
    .then((lineupFromDB) => {
      const data = {
        lineup: lineupFromDB,
      };
      res.render("lineups/lineups-details", data);
    })
    .catch((error) => {
      res.send("Error to create lineups..." + error);
    });
});

router.get("/lineups/:id/update", isLoggedIn, (req, res, next) => {
  let maps = [];
  let agents = [];
  Map.find().sort({ name: 1 })
    .then((mapsFromDB) => {
      maps = mapsFromDB;
      return Agent.find().sort({ name: 1 });;
    })
    .then((agentsFromDB) => {
      agents = agentsFromDB;
      return Lineup.findById(req.params.id).populate("agent").populate("map");
    })
    .then((lineupFromDB) => {
      res.render("lineups/lineups-update", {
        lineup: lineupFromDB,
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
  if (title === "") {
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
      .then((lineupFromDB) => {
        res.status(400).render("lineups/lineups-update", {
          errorMessage: "All fields are mandatory. Please provide title.",
          lineup: lineupFromDB,
          maps,
          agents,
        });
      });
  } else {
    Lineup.findByIdAndUpdate(
      req.params.id,
      { title, agent, map, lineUpType },
      { new: true }
    )
      .then((x) => {
        res.redirect("/lineups");
      })
      .catch((error) => {
        res.send("Error to update lineups..." + error);
      });
  }
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
