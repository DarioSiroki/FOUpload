const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");

const fileSizeInHumanReadableFormat = (fileSize) => {
  const i = Math.floor( Math.log(fileSize) / Math.log(1024) );
  return ( fileSize / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

const fileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const imageTypes = ["png", "jpg", "jpeg", "gif", "tiff", "BMP"];
  const audioTypes = ["mp3", "wav"];
  if(imageTypes.includes(extension)) return "image";
  if(audioTypes.includes(extension)) return "audio";
  if(extension==="txt") return "text";
  return undefined;
}

router.post("/", (req, res) => {
    if(req.isValidSession) {
        let htmltext = "";
        const pathx = path.join(STORAGE_PATH, String(req.user.id));
        let files = null;

        try {
            files = fs.readdirSync(pathx)
        }
        catch (err) {}

        if(files) {
            files.forEach(fileName => {
                const stats = fs.statSync(path.join(pathx,fileName));
                let mtime = new Date(stats.mtime);
                mtime = `${mtime.getDate()} ${months[mtime.getMonth()]} ${mtime.getFullYear()}`;
                const fileSize = fileSizeInHumanReadableFormat(stats["size"]);
                const type = fileType(fileName);
                let fileAction = "";
                if(type==="image") {
                  fileAction = `
                    <a href="javascript:void(0)" class="image-modal" data-toggle="modal" data-target="#exampleModal">${fileName}</a>
                  `
                } else {
                  fileAction = fileName;
                }
                htmltext += `
                <tr>
                    <td>${fileAction}</td>
                    <td>${mtime}</td>
                    <td>${fileSize}</td>
                    <td class="text-center">
                      <a href="/api/files/download?filename=${fileName}" title="Download"><i class="fas fa-download"></i></a>
                      <a href="javascript:void(0)" title="OCR"><i class="fas fa-camera"></i></a>
                      </td>
                </tr>
                `;
            });
        }
        res.send(htmltext);
    }
    else res.status(403).send("Not logged in");
});

module.exports = router;
