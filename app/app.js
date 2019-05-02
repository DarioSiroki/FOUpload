const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();

// Handlebars middleware
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");

// Body parser middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Cookie parse middleware
const cookieParser = require('cookie-parser')
server.use(cookieParser());

// API routes
server.use("/api/users", require("./api/users"));


// Handlebars routes
server.use(express.static("public"));

server.get("/", (req, res) => {
  const sessiondata = jwtVerify(req);
  const always = alwaysRender(sessiondata);
+ res.render("home", {
    title: "Home",
    always
  });
});
server.get("/user", (req, res) => {
  const sessiondata = jwtVerify(req);
  const always = alwaysRender(sessiondata);
  res.render("user", {
    errorMsg: req.body.msg,
    always
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));

let jwtVerify = (req) => {
  var data;
  jwt.verify(req.cookies.session, process.env.SECRET, (e, tmpdata) => {
    if(!e){
      data = tmpdata;
    }
  })
  return data;
}

let alwaysRender = (sessiondata) => {
  return {
    username: (sessiondata)?sessiondata.username:""
  };
}