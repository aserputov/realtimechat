const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  req.session.reset();
  res.redirect("/main");
});

module.exports = router;
