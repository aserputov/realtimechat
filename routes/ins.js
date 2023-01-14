const express = require("express");
const router = express.Router();
const User = require("../db/db");

router.post("/", (req, res) => {
  console.log(req.body.user);
  User.findOne({ username: req.body.user }, (error, user) => {
    if (error) {
      console.log(error);
      //   res.send({ success: false, message: "Error while searching for user" });
      res.redirect("/main");
    } else {
      console.log("User found successfully");
      console.log(user.password);
      console.log(req.body.pass);
      if (user.password === req.body.pass) {
        // res.send({ success: true, message: "Login successful" });
        req.session.user = {
          username: user.username,
        };
        res.redirect("/list");
      } else {
        // res.send({ success: false, message: "Incorrect password" });
        res.redirect("/main");
      }
    }
  });
});

module.exports = router;
