const express = require("express");
const exphbs  = require("express-handlebars");
const sequelize = require("./config/DatabaseHandler")
const app = express();

sequelize.query("SELECT * from users", {
    type: sequelize.QueryTypes.SELECT
  })
  .then(data=>{
    console.log(data);
  });

// Middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// API routes
app.use("/api/users", require("./api/users"));

app.get("/", (req,res) => res.render("home", {
  title: "Members list"
}));

app.get("/login", (req, res) => res.render("login"));

app.listen(5000, () => console.log("App running on port 5000."));
