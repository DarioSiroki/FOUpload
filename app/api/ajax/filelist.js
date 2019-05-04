const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");
const imageTypes = ["png","jpg","jpeg","gif","tiff","bmp","webm"];

const humanReadableSize = (size) => {
  const i = Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

router.post("/", (req, res) => {
    if(req.user) {
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
                const ext = file.split('.').pop();
                var stats = fs.statSync(path.join(pathx,file));
                var mtime = new Date(stats.mtime);
                mtime = `${mtime.getDay()} ${months[mtime.getMonth()]} ${mtime.getFullYear()}`;
                const size = humanReadableSize(stats.size);

                var pass = false;
                if(req.body.searchin == "filenames") {
                    if((file.indexOf(req.body.query) !== -1 && req.body.query) || req.body.query == "") {
                        pass = true;
                    }
                }
                else if(req.body.searchin == "files") {
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
                if(!req.body.ftype_image) {
                    if(imageTypes.indexOf(ext) !== -1)
                        pass = false;
                }
                if(pass) {
                  htmltext += `
                  <tr>
                      <td><a href="javascript:void(0)" data-toggle="modal" data-target="#exampleModal" class="file-name">${file}</a></td>
                      <td>${mtime}</td>
                      <td>${size}</td>
                      <td class="text-center">
                      <a href="/api/files/download?filename=${file}">
                        <i class="fas fa-download" title="Download"></i>
                      </a>
                        <a href="javascript:void(0)" title="OCR"><i class="fas fa-camera"></i></a>
                      </td>
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
