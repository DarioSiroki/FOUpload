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
  });
  next();
};

// API routes
<<<<<<< HEAD
const external = [
  "/api/users", 
  "/api/files", 
  "/api/ocr",
  "/api/ajax/filelist"
];

external.map(el => {
  server.use(el, require('.'+el));
});

=======
server.use("/api/users", require("./api/users"));
server.use("/api/files", require("./api/files"));
>>>>>>> b57073e1edde7d617db93ae4a2f16b6721898663

// Public files route
server.use(express.static("public"));

// Handlebars routes
server.get("/", verifySession, (req, res) => {
<<<<<<< HEAD
    res.render((req.user)?"loggedin":"home", {
=======
  if(req.user) {
      let htmltext = "";
      let counter = 1;
      const pathx = path.join(STORAGE_PATH, String(req.user.id));
      let files = null;

      try {
        files = fs.readdirSync(pathx)
      }
      catch (err) {}

      if(files) {
        files.forEach(file => {
          var stats = fs.statSync(path.join(pathx,file));
          var mtime = new Date(stats.mtime);
          htmltext += `
            <tr>
                <th>${counter++}</th>
                <td>${file}</td>
                <td>${mtime}</td>
                <td class="text-center"><a href="/api/files/download?filename=${file}"><i class="fas fa-download"></i></a></td>
            </tr>
          `;
        });
      }

      res.render("loggedin", {
        title: "FOUpload",
        always: req.user,
        filetable: htmltext
      });



  }
  else {
    res.render("home", {
>>>>>>> b57073e1edde7d617db93ae4a2f16b6721898663
      title: "FOUpload",
      always: req.user,
    });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
