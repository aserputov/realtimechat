const express = require("express");
const router = express.Router();
const User = require("../db/db");

router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user.save((error) => {
    if (error) {
      if (error.code === 11000) {
        res.redirect("/main");
        console.log("Username already exists" + error);
      } else {
        res.redirect("/main");
      }
    } else {
      req.session.user = {
        username: user.username,
      };
      console.log("User saved successfully");
      res.redirect("/list");
    }
  });
});

module.exports = router;
