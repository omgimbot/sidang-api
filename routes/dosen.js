const dosen = require("../controller/dosen");
const uploadConf = require("../config/uploadSetting");
const fields = uploadConf.upload.single("myFile");
module.exports = (router) => {

  router.post("/inputPenguji", (req, res) => {
    let data = req.body
      dosen
        .inputPenguji(data)
        .then((result) => {
          res.json(result)
        }).catch((err) => {
          res.json(err)
        })
    })

  router.delete("/hapuspenguji/:id", (req, res) => {
    let id = req.params.id
    // console.log(id)
    dosen.hapusPenguji(id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
  })

    router.post("/inputMk", (req, res) => {
    let data = req.body
    // console.log(data)
      dosen
        .inputMk(data)
          .then((result) => {
            res.json(result)
          }).catch((err) => {
            res.json(err)
          })
    })

    router.get("/getlistpenguji", (req, res) => {
      // console.log("sadfsff")
      dosen
        .getListPenguji()
          .then((result) => res.json(result))
          .catch((err) => {
            console.log(err)
          });
  });

    router.get("/listmk", (req, res) => {
      dosen
        .getListMk()
          .then((result) => res.json(result))
          .catch((err) => res.status(err.status).json({ message: err.message }));
  });

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
