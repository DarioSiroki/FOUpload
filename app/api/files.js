const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

router.use(fileUpload());

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.user = e ? "" : data;
  });
  next();
};

router.put("/", (req, res) => {
  res.send("nice");
  console.log(req.files);
})

module.exports = router;
