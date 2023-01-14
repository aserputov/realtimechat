const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("list", { user: req.session.user.username });
});

module.exports = router;
