const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fileUpload = require('express-fileupload');
const fs = require("fs");
const path = require("path");
const vision = require('@google-cloud/vision');

const STORAGE_PATH = path.join(__dirname, "..", "storage");

// express-fileupload middleware
router.use(fileUpload());

const detectText = async(imgPath) => {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection(imgPath);
  const detections = result.textAnnotations;
  return detections[0].description
}

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.isValidSession = e ? false : true;
    req.userData = data;
  });
  next();
};

router.put("/", verifySession, (req, res) => {
  if(req.isValidSession) {
    if(req.files) {
      const file = req.files.file;
      // Create upload path string
      const uploadPath = path.join(STORAGE_PATH, String(req.userData.id));
      // Create folders recursively if path doesn't exist
      fs.access(uploadPath, e => {
        if(e) fs.mkdirSync(uploadPath, { recursive: true });
      });
      // Create file in upload destination
      const filePath = path.join(uploadPath, file.name);
      file.mv(filePath, e => {
        if(e) res.status(500).send("Server error");
        else {
          res.send("File uploaded");
          // Create text file of image
          if(req.body.ocr) {
            const text = detectText(uploadPath);
            fs.writeFileSync(filePath + ".txt", text, (e) => if(e) console.log(e));
          }
        };
      });
    } else {
      if(req.body.folder){
        // Create folders recursively if path doesn't exist
        const folderPath = path.join(STORAGE_PATH, String(req.userData.id), req.body.folder);
        fs.access(folderPath, e => {
          if(e) fs.mkdirSync(folderPath, { recursive: true });
        });
        res.send("Folder created");
      } else {
        res.status(403).send("Invalid request, no file received");
      }
    }
  } else {
    res.status(403).send("Authentication error");
  }
});

router.delete("/", verifySession, (req, res) => {
  if(req.isValidSession){
    if(req.body.path){
      const deletePath = path.join(STORAGE_PATH, String(req.userData.id), req.body.path);
      fs.unlink(deletePath);
      res.send("Deleted successfully");
    } else {
      res.status(403).send("Invalid request");
    }
  } else {
    res.status(403).send("Authentication error");
  }
});

module.exports = router;
