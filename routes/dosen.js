const dosen = require("../controller/dosen");
const uploadConf = require("../config/uploadSetting");
const fields = uploadConf.upload.single("myFile");
module.exports = (router) => {
    router.post("/acc", fields, (req, res) => {
      let value = JSON.parse(req.body.data);
      value.surattugas = req.file.filename
      dosen
        .acc(value)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.json(err);
        });
    })

    router.post("/tolak", (req, res) => {
      let nim = req.body.nim
      let status = req.body.status
      let key = req.body.key
      console.log(status)
      dosen
        .tolak(nim,status,key)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.json(err);
        });
    })
}
