const dosen = require("../controller/dosen");
const mhs = require("../controller/mhs");
const uploadConf = require("../config/uploadSetting");
const fields = uploadConf.upload.single("myFile");
const ExcelJS = require("exceljs");
// const workbook = new ExcelJS.Workbook();
module.exports = (router) => {
  router.post("/inputPengujiMhs", (req, res) => {
    let data = req.body;
    dosen
      .inputPengujiMhs(data)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/getListPengujiMhs/:nim", (req, res) => {
    // console.log("sadfsff")
    let nim = req.params.nim;
    dosen
      .getListPengujiMhs(nim)
      .then((result) => res.json(result))
      .catch((err) => {
        console.log(err);
      });
  });

  router.post("/inputPenguji", (req, res) => {
    let data = req.body;
    dosen
      .inputPenguji(data)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.put("/updatePenguji/:id", (req, res) => {
    dosen
      .updatePenguji(req.body, req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.delete("/hapuspenguji/:id", (req, res) => {
    let id = req.params.id;
    // console.log(id)
    dosen
      .hapusPenguji(id)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  });

  router.post("/inputMk", (req, res) => {
    let data = req.body;
    // console.log(data)
    dosen
      .inputMk(data)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/getlistpenguji", (req, res) => {
    // console.log("sadfsff")
    dosen
      .getListPenguji()
      .then((result) => res.json(result))
      .catch((err) => {
        console.log(err);
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
    value.surattugas = req.file.filename;
    dosen
      .acc(value)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.post("/tolak", (req, res) => {
    let nim = req.body.nim;
    let status = req.body.status;
    let key = req.body.key;
    console.log(status);
    dosen
      .tolak(nim, status, key)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/exportexcel", (req, res) => {
    // res.writeHead(200, {
    //   'Content-Disposition': 'attachment; filename="filesss.xlsx"',
    //   'Transfer-Encoding': 'chunked',
    //   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // })
    // var workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res })
    // var worksheet = workbook.addWorksheet('some-worksheet')
    // worksheet.columns = [
    //     { header: 'NAMA', key: 'nama', width: 35,style: { font: { name: 'Arial Black' } }},
    //     { header: 'NPM', key: 'npm', width: 35,style: { font: { name: 'Arial Black' } }},
    //     { header: 'TEMPAT/TANGGAL LAHIR', key: 'TTL', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'GENDER', key: 'gender', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'SUKU', key: 'suku', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'ALAMAT', key: 'alamat', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'NO HP', key: 'noHp', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'FAKULTAS', key: 'fak', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PRODI', key: 'prodi', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'TANGGAL MASUK', key: 'tglMasuk', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PRESTASI', key: 'prestasi', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'JUDUL SKRIPSI', key: 'judulSkripsi', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PEMBIMBING I', key: 'pembimbing1', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PEMBIMBING II', key: 'pembimbing2', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'TANGGAL LULUS', key: 'tglLulus', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'IPK', key: 'ipk', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PREDIKAT', key: 'predikat', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'PEKERJAAN', key: 'pekerjaan', width: 20,style: { font: { name: 'Arial Black' } }},
    //     { header: 'TANGGAL MASUK KERJA', key: 'tglMasukKerja', width: 20,style: { font: { name: 'Arial Black' } }}
    //   ];
    //        worksheet.commit()
    //   workbook.commit()
    mhs
      .getAllTracer()
      .then(async (result) => {
        res.writeHead(200, {
          "Content-Disposition": 'attachment; filename="files.xlsx"',
          "Transfer-Encoding": "chunked",
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var workbook = new ExcelJS.stream.xlsx.WorkbookWriter({stream : res});
        var worksheet = workbook.addWorksheet("some-worksheet");

        worksheet.columns = [
          {
            header: "NAMA",
            key: "nama",
            width: 35,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "NPM",
            key: "npm",
            width: 35,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "TEMPAT/TANGGAL LAHIR",
            key: "ttl",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "GENDER",
            key: "gender",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "SUKU",
            key: "suku",
            width: 20,
            style: { font: { name: "Arial Black" }  , Bold: true},
          },
          {
            header: "ALAMAT",
            key: "alamat",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "NO HP",
            key: "noHp",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "FAKULTAS",
            key: "fak",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PRODI",
            key: "prodi",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "TANGGAL MASUK",
            key: "tglMasuk",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PRESTASI",
            key: "prestasi",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "JUDUL SKRIPSI",
            key: "judulSkripsi",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PEMBIMBING I",
            key: "pembimbing1",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PEMBIMBING II",
            key: "pembimbing2",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "TANGGAL LULUS",
            key: "tglLulus",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "IPK",
            key: "ipk",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PREDIKAT",
            key: "predikat",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "PEKERJAAN",
            key: "pekerjaan",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
          {
            header: "TANGGAL MASUK KERJA",
            key: "tglMasukKerja",
            width: 20,
            style: { font: { name: "Arial Black" } },
          },
        ];
        
        

        for (i in result) {
          await worksheet.addRow({
            nama: result[i].nama,
            npm: result[i].npm,
            ttl: result[i].tempatLahir +"/" + result[i].tanggalLahir,
            gender: result[i].gender,
            suku: result[i].suku,
            alamat: result[i].alamat,
            noHp: result[i].noHp,
            fak: result[i].fak,
            prodi: result[i].prodi,
            tglMasuk: result[i].tglMasuk,
            prestasi: result[i].prestasi,
            judulSkripsi: result[i].judulSkripsi,
            pembimbing1: result[i].pembimbing1,
            pembimbing2: result[i].pembimbing2,
            tglLulus: result[i].tglLulus,
            ipk: result[i].ipk,
            predikat: result[i].predikat,
            pekerjaan: result[i].pekerjaan,
            tglMasukKerja: result[i].tglMasukKerja,
          });
        }
        await worksheet.commit();
        await workbook.commit();
        await res.end();
      })
      .catch((err) => {
        res.json(err);
      });
  });
};
