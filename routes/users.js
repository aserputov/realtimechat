const express = require("express");
const router = express.Router();
const User = require("../db/db");

router.get("/", (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log(error);
    } else {
      //   console.log(users);
      res.json(users);
    }
  });
});

module.exports = router;
