const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  res.redirect("/");
});

router.post("/register", (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  res.redirect("/");
});

module.exports = router;
