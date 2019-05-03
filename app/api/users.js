const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sequelize = require("../config/DatabaseHandler")
const sha512 = require('js-sha512').sha512;

// Cookie parse middleware
const cookieParser = require('cookie-parser')
router.use(cookieParser());

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  sequelize.query("SELECT * from users where email=:email or username=:email LIMIT 1", {
      replacements: {email: email},
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      if(!data.length) {
        res.status(403).json({msg: "Invalid username/email"});
      } else if(sha512(password)!==data[0].password) {
        res.status(403).json({msg: "Invalid password"})
      } else {
        jwt.sign({ "username": data[0].username }, process.env.SECRET, (err, token) => {
          res.cookie("session", token);
          res.json({msg: "Successfully logged in"});
        });
      }
    });
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = sha512(req.body.password);
  sequelize.query(`SELECT id from users where email=:email or username=:username LIMIT 1`, { // ne treba selectat sve kad je samo za provjeru
      replacements: {
          email: email,
          username: username
      },
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      if(data.length) {
        res.status(403).json({msg: "Username or email already exists"});
      } else {
        sequelize.query(`INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`, {
            replacements: {
              username: username,
              email: email,
              password: password
            }
        })
        .then(data=>{
            jwt.sign({ "username": username }, process.env.SECRET, (err, token) => {
              res.cookie("session", token);
              res.json({msg: "Successfully logged in"});
            });
          });
      }
    });

});

router.get("/logout", (req,res) => {
  res.clearCookie("session");
  res.redirect("/");
});

module.exports = router;
