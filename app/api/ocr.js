const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const STORAGE_PATH = path.join(__dirname, "..", "storage");

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.isValidSession = e ? false : true;
    req.userData = data;
  });
  next();
};

const detectText = async(imgPath) => {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection(imgPath);
  const detections = result.textAnnotations;
  return detections[0].description
}

router.post("/", verifySession, (req, res) => {
  if(req.isValidSession) {
    if(req.body.path) {
      const imgPath = path.join(STORAGE_PATH, String(req.userData.id), req.body.path);
      //const imgPath = path.join(STORAGE_PATH, String(5), "ocr.jpg");
      const text = detectText(imgPath);
      res.send(text);
    } else {
      res.status(403).send("Invalid request");
    }
  } else {
    res.status(403).send("Authentication error");
  }
});

module.exports = router;
