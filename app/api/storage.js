const express = require("express");
const router = express.Router();
require("dotenv").config();
const server = express();
const fs = require('fs')
const path = require("path");


router.get(/storage/, (req, res) => {
  console.log("HI");
});

module.exports = router;
