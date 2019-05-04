const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");


const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");

const verifySession = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SECRET, (e, data) => {
    req.isValidSession = e ? false : true;
    req.userData = data;
  });
  next();
};

router.post("/", verifySession, (req, res) => {
    if(req.userData) {
        let htmltext = "";
        let counter = 1;
        const pathx = path.join(STORAGE_PATH, String(req.userData.id));
        let files = null;
        
        try {
            files = fs.readdirSync(pathx)
        }
        catch (err) {}
        if(files) {
            files.forEach(file => {
                var stats = fs.statSync(path.join(pathx,file));
                var mtime = new Date(stats.mtime);
                var pass = false;
                console.log(req.body.searchin);
                if(req.body.searchin == "filenames") {
                    if((file.indexOf(req.body.query) !== -1 && req.body.query) || req.body.query == "") {
                        pass = true;
                    }
                }
                else if(req.body.searchin == "files") {
                    const ext = file.split('.').pop();
                    if(!req.body.query) {
                        pass = true;
                    }
                    if(ext == "txt") {
                        try {
                            const fdata = fs.readFileSync(path.join(pathx,file));
                            if(fdata.includes(req.body.query)) {
                                pass = true;
                            }
                        }
                        catch {}
                    }

                }
                if(pass) {
                    htmltext += `
                    <tr>
                        <th>${counter++}</th>
                        <td>${file}</td>
                        <td>${mtime}</td>
                        <td class="text-center"><a href="/api/files/download?filename=${file}"><i class="fas fa-download"></i></a></td>
                    </tr>
                    `;
                }
        
            });
        }
        res.send(htmltext);
    }
    else res.status(403).send("Not logged in");
});

module.exports = router;
