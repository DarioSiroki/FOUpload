const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sequelize = require("../config/DatabaseHandler")
const sha512 = require('js-sha512').sha512;

// Cookie parse middleware
const cookieParser = require('cookie-parser');
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
        jwt.sign({ "username": data[0].username, "id": data[0].id }, process.env.SECRET, (err, token) => {
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
          sequelize.query("SELECT LAST_INSERT_ID()", {type: sequelize.QueryTypes.SELECT})
            .then(id => {
              id = id[0]["LAST_INSERT_ID()"];
              jwt.sign({ "username": username, "id": id }, process.env.SECRET, (err, token) => {
                res.cookie("session", token);
                res.json({msg: "Successfully logged in"});
              });
            });
        });
      }
    });
});

router.post("/changepassword", (req, res) => {
  if(req.user) {
    const currentpw = sha512(req.body.settings_currentpw);
    const newpw     = sha512(req.body.settings_newpw);
    sequelize.query(`SELECT id from users where id=:id and password=:password LIMIT 1`, { 
      replacements: {
          id: req.user.id,
          password: currentpw
      },
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      if(data[0]) {
        sequelize.query(`UPDATE users SET password=:password WHERE id=:id`, {
          replacements: {
              id: req.user.id,
              password: newpw
          }
        }).then(()=>{
          res.send("Successfully changed your password. ");
        });
      }
      else {
        res.status(403).json({msg: "Current password incorrect."});
      }
    });
  }

});

router.get("/logout", (req,res) => {
  res.clearCookie("session");
  res.redirect("/");
});

module.exports = router;
