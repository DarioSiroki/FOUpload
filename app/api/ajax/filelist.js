const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");
const getIconForExtension = require("font-awesome-filetypes").getIconForExtension;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STORAGE_PATH = path.join(__dirname, "..", "..", "storage");


const imageTypes = ["png","jpg","jpeg","gif","tiff","bmp","webm"];
const audioTypes = ["3gp","aa","aac" ,"aax" ,"act" ,"aiff" ,"amr" ,"ape" ,"au","awb","dct" ,"dss" ,"dvf" ,"flac" ,"gsm" ,"iklax" ,"ivs" ,"m4a" ,"m4b" ,"m4p" ,"mmf" ,"mp3" ,"mpc" ,"msv" ,"nmf" ,"nsf" ,"ogg"   ,"opus" ,"ra"    ,"raw" ,"sln" ,"tta" ,"voc" ,"vox" ,"wav" ,"wma" ,"wv","webm" ,"8svx"];
const humanReadableSize = (size) => {
  const i = Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}
const isDir = (path) => {
    try {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

router.post("/", (req, res) => {
    if(req.user) {
        let htmltext = "";
        let counter = 1;
        const pathx = path.join(STORAGE_PATH, String(req.user.id), req.body.path || "");

        try {
          files = fs.readdirSync(pathx);
        }
        catch (err) {
          files = [];
        }
        files = files.map(e => ({
            name: e,
            isDir: isDir(path.join(STORAGE_PATH, String(req.user.id), req.body.path || "", e))
        }))
        folders = files.filter(e=>e.isDir);
        files = files.filter(e=>!folders.includes(e));
        files = folders.concat(files);
        if(files) {
            const curtime = new Date();
            files.forEach(file => {
                const ext = file.name.split('.').pop();
                const icon = getIconForExtension(ext)
                var stats = fs.statSync(path.join(pathx,file.name));
                var mtime = new Date(stats.mtime);
                const dateDif = (curtime.getTime() - mtime.getTime()) / (1000 * 60 * 60 * 24);
                mtime = `${mtime.getDate()} ${months[mtime.getMonth()]} ${mtime.getFullYear()}`;
                const size = humanReadableSize(stats.size);

                var pass = true;
                if(req.body.searchin == "filenames") {
                    if(file.name.indexOf(req.body.query) === -1 && req.body.query) {
                        pass = false;
                    }
                }
                else if(req.body.searchin == "files") {
                    if(req.body.query) {
                        if(ext == "txt") {
                            try {
                                const fdata = fs.readFileSync(path.join(pathx,file.name));
                                if(!fdata.includes(req.body.query)) {
                                    pass = false;
                                }
                            }
                            catch {}
                        }
                        else pass = false;
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
                if(req.body.path) pass = true;
                if(pass) {
                  htmltext += `
                  <tr>
                      <td>
                      ${icon}
                      <td><a href="javascript:void(0)" ${
                        file.isDir ?
                        `class="folder-name"`:
                        `data-toggle="modal" data-target="#exampleModal"
                         class="file-name"`
                      }
                      >${file.name}</a></td>
                      <td>${mtime}</td>
                      <td>${size}</td>
                      <td class='fileoptions'>
                      <a href="/api/files/download?filename=${file.name}">
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
                      <input type='checkbox' style='display:none' class='comparebox' ${(ext != "txt")?"disabled":""}>
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
