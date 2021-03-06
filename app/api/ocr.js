const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const vision = require('@google-cloud/vision');

const STORAGE_PATH = path.join(__dirname, "..", "storage");

const detectText = async(imgPath) => {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection(imgPath);
  const detections = result.textAnnotations;
  try{
    return detections[0].description;
  } catch {
    return "Could not process image";
  }
}

router.post("/", async(req, res) => {
  if(req.isValidSession) {
    if(req.body.path) {
      const uploadPath = path.join(STORAGE_PATH, String(req.user.id), req.body.path);
      const text = await detectText(uploadPath);
      res.send(text);
    } else {
      res.status(403).send("Invalid request");
    }
  } else {
    res.status(403).send("Authentication error");
  }
});

module.exports = router;
