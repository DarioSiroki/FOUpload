const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fileUpload = require('express-fileupload');
const fs = require("fs");

router.use(fileUpload());

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.allow = e ? false : true;
    req.userData = data;
  });
  next();
};

router.put("/", verifySession, (req, res) => {
  if(req.allow) {
    if(req.files) {

    } else {
      res.status(403).send("Invalid request, no file received")
    }
  } else {
    res.status(403).send("Authentication error");
  }
});

module.exports = router;
