const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");


const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");

router.post("/", (req, res) => {
    if(req.isValidSession) {
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
        res.send(htmltext);
    }
    else res.status(403).send("Not logged in");
});

module.exports = router;
