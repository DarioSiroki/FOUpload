const express = require("express");
const exphbs = require("express-handlebars");
const sequelize = require("./config/DatabaseHandler");
require("dotenv").config();
const server = express();

// Handlebars middleware
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");

// Body parser middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// API routes
server.use("/api/users", require("./api/users"));

// Handlebars routes
server.use(express.static("public"));
server.get("/", (req, res) =>
  res.render("home", {
    title: "Home"
  })
);
server.get("/user", (req, res) =>
  res.render("user", {
    errorMsg: req.body.msg
  })
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running on port ${PORT}.`));
