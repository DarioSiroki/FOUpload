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
  sequelize.query(`SELECT * from users where email='${email}' or username='${email}'`, {
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      if(!data.length) {
        console.log("inv un")
        res.status(403).json({msg: "Invalid username/email"});
      } else if(sha512(password)!==data[0].password) {
        console.log("inv pw")
        res.status(403).json({msg: "Invalid password"})
      } else {
        console.log("valid")
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
  sequelize.query(`SELECT * from users where email='${email}' or username='${username}';`, {
      type: sequelize.QueryTypes.SELECT
    })
    .then(data=>{
      if(data.length) {
        res.status(403).json({msg: "Username or email already exists"});
      } else {
        sequelize.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}');`)
          .then(data=>{
            jwt.sign({ "username": username }, process.env.SECRET, (err, token) => {
              res.cookie("session", token);
              res.json({msg: "Successfully logged in"});
            });
          });
      }
    });

});

module.exports = router;
