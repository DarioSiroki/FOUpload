const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();
const fs = require('fs')
const path = require("path");
const verifyStorageAccess = require("./api/ajax/verifyStorageAccess");


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
  });
  next();
};

// API routes
const external = [
<<<<<<< HEAD
  "/api/users",
  "/api/files",
  "/api/ajax/filelist",
=======
  "/api/users", 
  "/api/files", 
  "/api/ajax/filelist"
>>>>>>> a3d765a0d8d743cbfa50e70dc54f70c6391b1c4b
];

external.map(el => {
  server.use(el, require('.'+el));
});
<<<<<<< HEAD
=======

>>>>>>> a3d765a0d8d743cbfa50e70dc54f70c6391b1c4b

// Public files route
server.use(express.static("public"));
server.use("/storage", verifyStorageAccess, express.static("storage"));

// Handlebars routes
server.get("/", verifySession, (req, res) => {
    res.render((req.user)?"loggedin":"home", {
      title: "FOUpload",
      always: req.user,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
