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
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Cookie parse middleware
const cookieParser = require("cookie-parser");
server.use(cookieParser());

// Session verification middleware
let verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.user = e ? "" : data;
  });
  next();
};
server.use(verifySession);

// API routes
server.use("/api/users", require("./api/users"));

// Handlebars routes
server.use(express.static("public"));

server.get("/", verifySession, (req, res) => {

  +res.render("home", {
    title: "Home",
    always: req.user
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
