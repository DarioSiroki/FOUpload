const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");


const imageTypes = ["png","jpg","jpeg","gif","tiff","bmp","webm"];
const audioTypes = ["3gp","aa","aac" ,"aax" ,"act" ,"aiff" ,"amr" ,"ape" ,"au","awb","dct" ,"dss" ,"dvf" ,"flac" ,"gsm" ,"iklax" ,"ivs" ,"m4a" ,"m4b" ,"m4p" ,"mmf" ,"mp3" ,"mpc" ,"msv" ,"nmf" ,"nsf" ,"ogg"   ,"opus" ,"ra"    ,"raw" ,"sln" ,"tta" ,"voc" ,"vox" ,"wav" ,"wma" ,"wv","webm" ,"8svx"];
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
            const curtime = new Date();
            files.forEach(file => {
                const ext = file.split('.').pop();
                var stats = fs.statSync(path.join(pathx,file));
                var mtime = new Date(stats.mtime);
                const dateDif = (curtime.getTime() - mtime.getTime()) / (1000 * 60 * 60 * 24);
                mtime = `${mtime.getDate()} ${months[mtime.getMonth()]} ${mtime.getFullYear()}`;
                const size = humanReadableSize(stats.size);

                var pass = true;
                if(req.body.searchin == "filenames") {
                    if(file.indexOf(req.body.query) === -1 && req.body.query) {
                        pass = false;
                    }
                }
                else if(req.body.searchin == "files") {
                    if(ext == "txt") {
                        try {
                            const fdata = fs.readFileSync(path.join(pathx,file));
                            if(!fdata.includes(req.body.query)) {
                                pass = false;
                            }
                        }
                        catch {}
                    }

                }

                if(!req.body.ftype_image) {
                    if(imageTypes.indexOf(ext) !== -1)
                        pass = false;
                }


                if(!req.body.ftype_audio) {
                    if(audioTypes.indexOf(ext) !== -1)
                        pass = false;
                }

                if(!(isNaN(parseInt(req.body.dateuploaded, 10))) && (dateDif > parseInt(req.body.dateuploaded, 10))) {
                    pass = false;
                }

                if(!isNaN(parseFloat(req.body.size))) {
                    if(req.body.sizetype == ">") {
                        if(stats.size / Math.pow(1024, 2) < parseFloat(req.body.size)) {
                            pass = false;
                        }
                    }
                    else {
                        if(stats.size / Math.pow(1024, 2) > parseFloat(req.body.size)) {
                            pass = false;
                        }
                    }
                }


                if(pass) {
                  htmltext += `
                  <tr>
                      <td><a href="javascript:void(0)" data-toggle="modal" data-target="#exampleModal" class="file-name">${file}</a></td>
                      <td>${mtime}</td>
                      <td>${size}</td>
                      <td>
                      <a href="/api/files/download?filename=${file}">
                        <i class="fas fa-download" title="Download"></i>
                      </a>
                    `;
                  htmltext += `
                      <a href="javascript:void(0)" 
                      title="OCR ${(imageTypes.indexOf(ext) === -1)?`(not available for non-photo files)`:``}" 
                      class="ocr-btn ${(imageTypes.indexOf(ext) === -1)?`disabled`:``}" 
                      ${(imageTypes.indexOf(ext) !== -1)?`data-toggle="modal" data-target="#exampleModal"`:``}>
                            <i class="fas fa-camera"></i>
                      </a>`;
                  htmltext += `
                      <a href="javascript:void(0)" title="Delete" class="delete-btn"><i class="fas fa-trash"></i></a>
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
