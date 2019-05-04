const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const tesseract = require('node-tesseract-ocr')

const STORAGE_PATH = path.join(__dirname, "..", "storage");

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.isValidSession = e ? false : true;
    req.userData = data;
  });
  next();
};

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3
}


router.get("/", verifySession, (req, res) => {
  //const imgPath = path.join(STORAGE_PATH, String(req.userData.id), req.body.path);
  const imgPath = path.join(STORAGE_PATH, String(5), );
  tesseract
    .recognize(imgPath, config)
    .then(text => {
      console.log('Result:', text)
    })
    .catch(err => {
      console.log('error:', err)
    })
    res.send("gg");
})

module.exports = router;
