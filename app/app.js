const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();
const fs = require('fs')
const path = require("path");


const STORAGE_PATH = path.join(__dirname, "storage");

// Handlebars middleware
server.engine("handlebars", exphbs({ defaultLayout: "main", partialsDir: __dirname + '/views/partials/' }));
server.set("view engine", "handlebars");

// Body parser middleware
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 1000000}));

// Cookie parse middleware
const cookieParser = require("cookie-parser");
server.use(cookieParser());

// Session verification function
const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.user = e ? "" : data;
    req.isValidSession = e ? false : true;
  });
  if(req.originalUrl.indexOf("/download")>-1 || req.originalUrl.indexOf("/storage")>-1){
    if(!req.isValidSession) {
      res.status(403).send("Authentication error");
    } else if(req.originalUrl.indexOf("/storage")>-1){
      const reqId = req.originalUrl.split("/")[2]
      if(parseInt(reqId)===parseInt(req.user.id)) next();
    }
  } else {
    next();
  }
};
server.use(verifySession);

// API routes
const external = [
  "/api/users",
  "/api/files",
  "/api/ajax/filelist"
];

external.map(el => {
  server.use(el, require('.'+el));
});
console.log(__dirname + "/api/ajax/exposeStorage");
server.use("/storage", require(__dirname + "/api/ajax/exposeStorage"));

// Public files route
server.use(express.static("public"));

// Handlebars routes
server.get("/", (req, res) =>{
  res.render((req.user)?"loggedin":"home", {
    title: "FOUpload",
    always: req.user,
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
