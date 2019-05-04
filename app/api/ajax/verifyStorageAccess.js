const path = require("path");

const verifyStorageAccess = (req, res, next) => {
  if(req.isValidSession) {
    if(isNaN(req.originalUrl.replace("/storage/", "").split("/")[0])) {
      let pcs = req.originalUrl.split("/");
      pcs.shift();
      const redirect = path.join(pcs.shift(), String(req.user.id), ...pcs);
      res.send(redirect);
    } else {
      next();
    }
  } else {
    res.status(403).send("Authentication error");
  }
}

module.exports = verifyStorageAccess;
