const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();

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
server.use("/api/users", require("./api/users"));
server.use("/api/files", require("./api/files"));

// Public files route
server.use(express.static("public"));

// Handlebars routes
server.get("/", verifySession, (req, res) => {
  if(req.user) {
    sequelize.query(`SELECT * from files where user_id=:id`, { 
      replacements: {
          id: req.user.id
      },
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      let html = "";
      data.map(el => {
        let counter = 1;
        html += `
          <tr>
              <th>${counter++}</th>
              <td>${el.path}</td>
              <td>${el.date}</td>
              <td class="text-center"><a href="javascript:void(0)"><i class="fas fa-download"></i></a></td>
          </tr>
        `;
      });
      res.render("loggedin", {
        title: "FOUpload",
        always: req.user,
        filetable: html
      });
    });
  }
  else {
    res.render("home", {
      title: "FOUpload",
      always: req.user,
    });
  }
  
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
