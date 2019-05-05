const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();
const fs = require('fs')
const path = require("path");
const verifyStorageAccess = require("./api/ajax/verifyStorageAccess");
const getSize = require('get-folder-size');



const STORAGE_PATH = path.join(__dirname, "storage");

const MAX_DISK_USAGE = 1024;
const MAX_FILES_FOLDERS = 1000;

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
  next();
};
server.use(verifySession);

// API routes
const external = [
  "/api/users",
  "/api/files",
  "/api/ajax/filelist",
  "/api/ocr"
];

external.map(el => {
  server.use(el, require('.'+el));
});

// Public files route
server.use(express.static("public"));
server.use("/storage", verifyStorageAccess, express.static("storage"));

// Handlebars routes
server.get("/", (req, res) => {
    res.render((req.user)?"loggedin":"home", {
      title: "FOUpload",
      always: req.user,
    });
});

server.get("/api/docs", (req, res) => {
  res.render("apiDocs", {
    title: "API docs",
    always: req.user
  });
})

server.get("/settings", (req, res) => {
  if(req.user) {
    sequelize.query("SELECT email from users where id=:id LIMIT 1", {
      replacements: {id: req.user.id},
      type: sequelize.QueryTypes.SELECT
    })
    .then(dbdata=>{
      getSize(path.join(STORAGE_PATH, String(req.user.id)), (err, size) => {
        fs.readdir(path.join(STORAGE_PATH, String(req.user.id)), (err, files) => {
          const mbsize = (size / 1024 / 1024).toFixed(0);
          const filesfolders = (files)?files.length:0;
          res.render("settings", {
            title: "FOUpload - User Settings",
            always: req.user,
            usage: mbsize,
            usagepercent: mbsize/MAX_DISK_USAGE*100,
            filesfolders: filesfolders,
            filesfolderspercent: filesfolders/MAX_FILES_FOLDERS*100,
            freespace: MAX_DISK_USAGE - mbsize,
            freespacepercent: (MAX_DISK_USAGE - mbsize)/MAX_DISK_USAGE*100,
            email: dbdata[0].email
          });

        });


      });

    });


  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
