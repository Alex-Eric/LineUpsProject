const express = require("express");
const router = express.Router();
const app = express();


/* GET home page */

router.get("/", (req, res, next) => {
  res.render("index");
});

// router.get("/", (req, res, next) => {
//   if (
//     req.session.currentUser
//     ) {
//       app.locals.logged = true;
//       console.log("IF",app.locals.logged)
//     } else {
//       app.locals.logged = false;
//       console.log("ELSE",app.locals.logged)
//     }
//     res.render("index");
// });
module.exports = router;
