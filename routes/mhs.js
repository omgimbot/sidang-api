const multer = require("multer");
const uploadConf = require("../config/uploadSetting");
const mhs = require("../controller/mhs");
const fields = uploadConf.upload.single("myFile");

module.exports = (router) => {
  router.post("/daftar", fields, (req, res) => {
    let value = JSON.parse(req.body.data);
    let data = {
      key: value.key,
      filename: req.file.filename,
      dosen: value.dosen,
      nama: value.nama,
      nim: value.nim,
      judul: value.judul,
      status : value.status,
      surattugas : value.surattugas,
      created_at : new Date().toISOString()
    };
    mhs
      .daftar(data)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.post("/tracerStudy", fields, (req, res) => {
    mhs
      .tracerStudi(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/listTracer", (req, res) => {
    mhs
      .getAllTracer()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/listTracerByNim/:nim", (req, res) => {
    let nim = req.params.nim
    mhs
      .getTracerByNim(nim)
      .then((result) => {
        res.json(result);
        console.log(result)
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/cekJudul/:nim/:key", (req, res) => {
    let nim = req.params.nim
    let key = req.params.key
    console.log
    mhs
      .cekJudul(nim,key)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/listpengajuan/:key/:nidn", (req, res) => {
    let key = req.params.key
    let nidn = req.params.nidn
    console.log(key)
    mhs
      .getAllPengajuan(key,nidn)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/listpengumuman/:nim", (req, res) => {
    let nim = req.params.nim
    mhs
      .getPengumuman(nim)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/listmhskompre/", (req, res) => {
    mhs
      .getMhsKompre()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });
  
};
