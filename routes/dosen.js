const dosen = require("../controller/dosen");
const mhs = require("../controller/mhs");
const uploadConf = require("../config/uploadSetting");
const fields = uploadConf.upload.single("myFile");
const { requestResponse } = require("../setup");

// const workbook = new ExcelJS.Workbook();
const ExcelJS = require("exceljs");
//pdf
const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');
const fs = require('fs')
pdfMake.vfs = vfsFonts.pdfMake.vfs;

module.exports = (router) => {

  const convertImageToBase64 = () => {
    const bitMap = fs.readFileSync('./static/pdf/uin.png', { encoding: 'base64' });
    return bitMap
  }

  const getBidang = (key) => {
    let bidang;
    if (key === "mk1" || key === "mk2") {
      bidang = "Agama"
    } else if (key === "mk3" || key === "mk4") {
      bidang = "KEPENDIDIKAN"
    } else if (key === "mk5" || key === "mk6") {
      bidang = "KEAHLIAN"
    }
    return bidang
  }

  router.get("/listmhskompre", (req, res) => {
    //  console.log("2321")
    dosen
      .listMhsKompre()
      .then((result) =>
        res.json(result))
      .catch((err) => {
        res.json(err);
      });
  });

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

  router.get("/exportpdf/:nim", (req, res) => {
    dosen.getListPengujiMhsPdf(req.params.nim)
      .then(async (dosens) => {
        // console.log(dosens)
        dosen.listMhsKompre()
          .then(async (result) => {
            // console.log(dosens)
            var today = new Date();
            var arrbulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            var date = '... ' + arrbulan[today.getMonth()] + ' ' + today.getFullYear();
            var dateDownload = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

            //bundle1
            //table page 1
            var header = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body = []

            for (c in header) {
              var headers = header[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body.push(row);
            }
            let noP1 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP1++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body.push(row);
            }

            //table page 4

            var headerP41 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP42 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP4 = []

            for (c in headerP41) {
              var headers = headerP41[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP4.push(row);
            }
            for (c in headerP42) {
              var headers = headerP42[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP4.push(row);
            }

            let noP4 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP4++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP4.push(row);
            }

            var headerP51 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP51 = []
            for (c in headerP51) {
              var headers = headerP51[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP51.push(row);
            }
            let noP51 = 1
            let noTtd = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP51++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP51.push(row);
            }

            let dosen = dosens[0].penguji[0].nama
            let nip = dosens[0].penguji[0].nim
            let materiUji = dosens[0].penguji[0].namaMk
            let bidang = dosens[0].penguji[0].kodeMk
            let bidangDosen = getBidang(bidang)

            //bundle2
            //table page 1
            var header1 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body1 = []

            for (c in header1) {
              var headers = header1[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body1.push(row);
            }
            let noP11 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP11++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body1.push(row);
            }

            //table page 4

            var headerP411 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP421 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP41 = []

            for (c in headerP411) {
              var headers = headerP411[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP41.push(row);
            }
            for (c in headerP421) {
              var headers = headerP421[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP41.push(row);
            }

            let noP41 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP41++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP41.push(row);
            }

            var headerP511 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP511 = []
            for (c in headerP511) {
              var headers = headerP511[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP511.push(row);
            }
            let noP511 = 1
            let noTtd1 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP511++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd1++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP511.push(row);
            }

            let dosen1 = dosens[0].penguji[1].nama
            let nip1 = dosens[0].penguji[1].nim
            let materiUji1 = dosens[0].penguji[1].namaMk
            let bidang1 = dosens[0].penguji[1].kodeMk
            let bidangDosen1 = getBidang(bidang1)

            //bundle3

            var header2 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body2 = []

            for (c in header2) {
              var headers = header2[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body2.push(row);
            }
            let noP12 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP12++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body2.push(row);
            }

            //table page 4

            var headerP412 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP422 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP422 = []

            for (c in headerP412) {
              var headers = headerP412[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP422.push(row);
            }
            for (c in headerP422) {
              var headers = headerP422[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP422.push(row);
            }

            let noP42 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP42++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP422.push(row);
            }

            var headerP512 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP512 = []
            for (c in headerP512) {
              var headers = headerP512[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP512.push(row);
            }
            let noP512 = 1
            let noTtd2 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP512++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd2++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP512.push(row);
            }
            let dosen2 = dosens[0].penguji[2].nama
            let nip2 = dosens[0].penguji[2].nim
            let materiUji2 = dosens[0].penguji[2].namaMk
            let bidang2 = dosens[0].penguji[2].kodeMk
            let bidangDosen2 = getBidang(bidang2)

            //bundle4

            var header3 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body3 = []

            for (c in header3) {
              var headers = header3[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body3.push(row);
            }
            let noP13 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP13++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body3.push(row);
            }

            //table page 4

            var headerP413 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP423 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP43 = []

            for (c in headerP413) {
              var headers = headerP413[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP43.push(row);
            }
            for (c in headerP423) {
              var headers = headerP423[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP43.push(row);
            }

            let noP43 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP43++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP43.push(row);
            }

            var headerP513 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP513 = []
            for (c in headerP513) {
              var headers = headerP513[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP513.push(row);
            }
            let noP513 = 1
            let noTtd3 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP513++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd3++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP513.push(row);
            }
            let dosen3 = dosens[0].penguji[3].nama
            let nip3 = dosens[0].penguji[3].nim
            let materiUji3 = dosens[0].penguji[3].namaMk
            let bidang3 = dosens[0].penguji[3].kodeMk
            let bidangDosen3 = getBidang(bidang3)

            //bundle4

            var header4 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body4 = []

            for (c in header4) {
              var headers = header4[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body4.push(row);
            }
            let noP14 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP14++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body4.push(row);
            }

            //table page 4

            var headerP414 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP424 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP44 = []

            for (c in headerP414) {
              var headers = headerP414[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP44.push(row);
            }
            for (c in headerP424) {
              var headers = headerP424[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP44.push(row);
            }

            let noP44 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP44++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP44.push(row);
            }

            var headerP514 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP514 = []
            for (c in headerP514) {
              var headers = headerP514[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP514.push(row);
            }
            let noP514 = 1
            let noTtd4 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP514++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd4++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP514.push(row);
            }

            let dosen4 = dosens[0].penguji[4].nama
            let nip4 = dosens[0].penguji[4].nim
            let materiUji4 = dosens[0].penguji[4].namaMk
            let bidang4 = dosens[0].penguji[4].kodeMk
            let bidangDosen4 = getBidang(bidang4)

            //bundle5

            var header5 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var body5 = []

            for (c in header5) {
              var headers = header5[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              body5.push(row);
            }
            let noP15 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP15++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              body5.push(row);
            }

            //table page 4

            var headerP415 = [{
              fila_0: {
                col_1: { rowSpan: 2, text: 'NO', alignment: 'center' },
                col_2: { rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { rowSpan: 2, text: 'NPM', alignment: 'center' },
                col_4: { colSpan: 2, text: 'NILAI', alignment: 'center' },
                col_5: { text: '', alignment: 'center' },
                col_6: { rowSpan: 2, text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var headerP425 = [{
              fila_0: {
                col_1: { text: '', alignment: 'center' },
                col_2: { text: '', alignment: 'center' },
                col_3: { text: '', alignment: 'center' },
                col_4: { text: 'ANGKA', alignment: 'center' },
                col_5: { text: 'HURUF', alignment: 'center' },
                col_6: { text: '', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'Header 6', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP45 = []

            for (c in headerP415) {
              var headers = headerP415[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP45.push(row);
            }
            for (c in headerP425) {
              var headers = headerP425[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              row.push(headers.fila_0.col_6)
              bodyP45.push(row);
            }

            let noP45 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP45++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' })
              row.push({ text: data.nim, alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              row.push({ text: '', alignment: 'center' })
              bodyP45.push(row);
            }

            var headerP515 = [{
              fila_0: {
                col_1: { text: 'NO', alignment: 'center' },
                col_2: { text: 'Nama Mahasiswa', alignment: 'center' },
                col_3: { text: 'NPM', alignment: 'center' },
                col_4: { text: 'Tanda Tangan', alignment: 'center' },
                col_5: { text: 'KET', alignment: 'center' },

              },
              fila_1: {
                col_1: { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Header 3', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Header 4', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Header 5', style: 'tableHeader', alignment: 'center' },

              }
            }]

            var bodyP515 = []
            for (c in headerP515) {
              var headers = headerP515[c];
              var row = new Array();
              row.push(headers.fila_0.col_1)
              row.push(headers.fila_0.col_2)
              row.push(headers.fila_0.col_3)
              row.push(headers.fila_0.col_4)
              row.push(headers.fila_0.col_5)
              bodyP515.push(row);
            }
            let noP515 = 1
            let noTtd5 = 1
            for (x in result) {
              var data = result[x];
              var row = new Array();
              row.push({ text: noP515++, alignment: 'center' });
              row.push({ text: data.nama, alignment: 'center' });
              row.push({ text: data.nim, alignment: 'center' });
              row.push({ text: noTtd5++ + '.', alignment: 'left' })
              row.push({ text: '', alignment: 'center' });
              bodyP515.push(row);
            }
            let dosen5 = dosens[0].- +penguji[5].nama
            let nip5 = dosens[0].penguji[5].nim
            let materiUji5 = dosens[0].penguji[5].namaMk
            let bidang5 = dosens[0].penguji[5].kodeMk
            let bidangDosen5 = getBidang(bidang5)

            // console.log(bodyP51q)

            var documentDefinition = {
              pageSize: 'A4',
              content: [
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP4
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen + '\nNIP. ' + await nip,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: await bodyP51
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen + '', '' + await bidangDosen, '' + await materiUji, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after',
                },

                //bundle2

                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen1 + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji1 + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body1
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen1,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji1,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP41
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen1 + '\nNIP. ' + await nip1,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: await bodyP511
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen1 + '', '' + await bidangDosen1, '' + await materiUji1, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after',
                },

                //bundel3

                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen2 + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji2 + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body2
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen2,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji2,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP422
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen2 + '\nNIP. ' + await nip2,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: bodyP512
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen2 + '', '' + await bidangDosen2, '' + await materiUji2, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after',
                },

                //bundle4

                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen3 + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji3 + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body3
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen3,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji3,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP43
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen3 + '\nNIP. ' + await nip3,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: bodyP513
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen3 + '', '' + await bidangDosen3, '' + await materiUji3, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after',
                },
                //bundle5

                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen4 + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji4 + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body4
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen4,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji4,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP44
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen4 + '\nNIP. ' + await nip4,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: bodyP514
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen4 + '', '' + await bidangDosen4, '' + await materiUji4, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after',
                },

                //bundle6

                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date,
                  ],
                  fontSize: 11,
                  alignment: 'right',
                  margin: [5, 15, 75, 20]
                },
                {
                  text: [
                    'Sifat                    : Penting\n',
                    'Lampiran           : 1 bundel\n',
                    'Perihal                : Ujian Komprehensif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  text: [
                    "Kepada\n" + await dosen5 + "\n Dosen Fakultas Tarbiyah dan Keguruan \n UIN Raden Intan Lampung"
                  ],
                  style: 'content2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Assalamu’alaikum Wr. Wb.',
                  ],
                  style: 'content2',
                  italics: true,
                  fontSize: 10,
                },
                {
                  text: [
                    'Sehubungan mahasiswa Pendidikan Matematika tersebut di bawah telah',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'menyelesaikan seluruh mata kuliah teori, maka untuk memenuhi syarat ujian akhir',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dimohon kesediannya memberi ujian komprehensif dengan materi ujian : ',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    await materiUji5 + ""
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'dengan waktu ujian pada : Tentatif'
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Adapun nama-nama mahasiswa yang akan menempuh ujian komprehensif',
                  ],
                  style: 'p1',
                  fontSize: 10,
                },
                {
                  text: [
                    'tersebut adalah:',
                  ],
                  style: 'content1',
                  fontSize: 10,
                },
                {
                  style: 'table',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [20, 200, 120],
                    body: await body5
                  }
                },
                {
                  text: [
                    'Nilai hasil ujian diserahkan kepada petugas/staf Prodi Pendidikan Matematika.',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Demikian, atas perhatian dan kerjasamanya diucapkan trimakasih',
                  ],
                  style: 'content1',
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Wassalamu’alaikum Wr. Wb.,',
                  ],
                  style: 'content1',
                  italics: true,
                  fontSize: 10,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Bandar Lampung, ' + await date + '\nKetua Prodi,',
                  ],
                  style: 'ttd',
                  fontSize: 10,
                },
                {
                  text: [
                    'Ttd',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                },
                {
                  text: [
                    'Dr. Nanang Supriadi, M.Sc.\nNIP. 197911282995011005 ',
                  ],
                  style: 'ttd2',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page2


                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'KISI-KISI UJIAN KOMPREHENSIF MAHASISWA JURUSAN PENDIDIKAN\nMATEMATIKA\nFAKULTAS TARBIYAH UIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 11,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'A.   BIDANG AGAMA',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Tauhid/Ilmu kalam dan Akhlak',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Tauhid/Ilmu Kalam dan Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Sejarah Perkembangan dan aliran-alirannya',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Macam-Macam Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Faktor-faktor yang mempengaruhi Akhlak',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Syari’ah (Ibadah dan mu’amalah)',
                  style: 'subList',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'a. Pengertian Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Dasar-Dasar Ibadah dan Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Macam-Macam Ibadah Mu’amalah',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Keterampilan Ibadah Praktis',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'B. BIDANG WAWASAN KEPENDIDIKAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Pendidikan Matematika ',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengembangan Perencanaan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Kurikulum Pendidikan Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Strategi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Evaluasi Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Penerapan Pembelajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Ketrampilan Dalam Perncanaan, Proses, dan Evaluasi Pengajaran',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Pengetahuan tentang perencanaan pengajaran ( Perumusan Tujuan, Bentuk, dan Isi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Pengajaran)',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Pengetahuan tentang Ketrampilan Mengejar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Pengetahuan tentang Ketrampilan Memilih, Menggunakan Metode mengajar bidang studi',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'Matematika',
                  style: 'ListSub',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Pengetahuan dan Ketrampilan menggunakan Alat-alat peraga Pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'e. Pengetahuan dan Ketrampilan dalam menyusun alat Evaluasi pengajaran Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'C. BIDANG KEAHLIAN',
                  style: 'headList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '(1) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Analisis Real',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Aljabar Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Struktur Aljabar',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Analisis Kompleks',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: '(2) Keilmuan Matematika',
                  style: 'subList',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: 'a. Program Linear',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'b. Trigonometri',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'c. Kalkulus',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: 'd. Logika Matematika',
                  style: 'List',
                  fontSize: 8,
                  bold: true,
                  pageBreak: 'after'
                },

                //page3
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'D. BUKU SUMBER',
                  style: 'headList2',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: '1.   Mahmoud Salthout, Al-Islam Aqidahwa Syari’ah',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '2.   HarunNasution, Islam Ditinjau dari berbagai Aspeknya',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '3.   HarunNasution, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '4.   A.Hanafi,M.A, Theologi Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '5.   Thaib Thair Abd.Muin, Ilmu Tauhid',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '6.   Undang-Undang Sistem Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '7.   HM.Arifin, Ilmu Pendidikan Nasional',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '8.   Nana Sudjana, Dasar-Dasar Proses BelajarMengajar',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '9.   H,Sulaiman Rasyid, Fiqh Islam',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '10.  Bartlet. Analisis Real',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '11.  Howard Anton. Aljabar Linear',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '12.  Purcel. Kalkulus',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '13. Statistika untuk Insinyur dan Ilmuwan.',
                  style: 'subList2',
                  fontSize: 9,
                },
                {
                  text: '14. Dll',
                  style: 'subList2',
                  fontSize: 9,
                  pageBreak: 'after'
                },

                //page4
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'DAFTAR NILAI KOMPREHENSIF',
                  margin: [0, 20, 0, 0],
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: [
                    'Penguji                      : ' + await dosen5,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Prodi                          : Pendidikan Matematika',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Bidang/Materi          : ' + await materiUji5,
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Hari/Tanggal             : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  text: [
                    'Waktu                         : . . . . . . . . . . . . . . . . . . . . . .',
                  ],
                  style: 'content1p4',
                  fontSize: 10,
                },
                {
                  style: 'table2',
                  layout: '', // optional
                  table: {
                    headerRows: 3,
                    widths: [20, 100, 60, 50, 50, 40],

                    body: await bodyP45
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nPenguji,',
                  ],
                  style: 'ttdP4',
                  fontSize: 10,
                },
                {
                  text: [
                    await dosen5 + '\nNIP. ' + await nip5,
                  ],
                  style: 'ttd2P4',
                  fontSize: 10,
                  bold: true,
                  pageBreak: 'after'
                },

                //page 5
                {
                  image: 'data:image/png;base64,' + await convertImageToBase64() + '',
                  width: '80',
                  margin: [-20, 0, 0, -50],
                },
                {
                  text: 'KEMENTERIAN AGAMA',
                  fontSize: 18,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'UNIVERSITAS ISLAM NEGERI RADEN INTAN LAMPUNG',
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: 'FAKULTAS TARBIYAH DAN KEGURUAN',
                  fontSize: 16,
                  bold: true,
                  alignment: 'center'
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                },
                {
                  text: 'Alamat : Jl. Let. Kol. H. Endro Suratmin Sukarame I Bandar Lampung (0721) 703260',
                  fontSize: 10,
                  italics: true,
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '____________________________________________________________________________________',
                  style: 'line',
                  alignment: 'center',
                  bold: false,
                  margin: [0, -10, 0, 0],
                },
                {
                  text: 'BERITA ACARA UJIAN KOMPREHENSIF\nMAHASISWA PRODI PENDIDIKAN MATEMATIKA FAKULTAS\nTARBIYAH\nDAN KEGURUAN IAIN RADEN INTAN LAMPUNG',
                  style: 'page2',
                  fontSize: 12,
                  bold: false,
                  alignment: 'center'
                },
                {
                  text: [
                    'Pada         hari        ini     . . . . .  . . . . . . . .Tanggal     . . . . .  . . . . . . . .        pukul',
                  ],
                  style: 'content1P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    '. . . . . . . . . s.d . . . . . . . . . bertempat di Fakultas Tarbiyah dan Keguruan UIN',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  text: [
                    'Raden    Intan Lampung,  telah dilaksanakan Ujian Komprehensif Wawasan',
                  ],
                  style: 'content2P5',
                  fontSize: 11,
                  alignment: 'justify'
                },
                {
                  style: 'tableP5',
                  layout: '', // optional
                  table: {
                    headerRows: 2,
                    widths: [20, 100, 60, 70, 70],
                    body: await bodyP515
                  }
                },
                {
                  text: [
                    'TIM PENGUJI',
                  ],
                  margin: [75, 25, 75, 0],
                  fontSize: 12,
                },
                {
                  style: 'table2P5',
                  layout: '', // optional
                  table: {
                    headerRows: 1,
                    widths: [120, 90, 120, 80],
                    heights: [0, 60],

                    body: [
                      [{ text: 'Nama Penguji', bold: true }, { text: 'Bidang', bold: true }, { text: 'Materi', bold: true }, { text: 'Tanda Tangan', bold: true }],
                      [await dosen5 + '', '' + await bidangDosen5, '' + await materiUji5, '']
                    ]
                  }
                },
                {
                  text: [
                    'Bandar Lampung.\nSekretaris,',
                  ],
                  style: 'ttdP5',
                  fontSize: 10,
                },
                {
                  text: [
                    'Riski wahyu yunian putra. M.Pd \nNIP.198906052015031004',
                  ],
                  style: 'ttd2P5',
                  fontSize: 10,
                  bold: true,
                },
              ],

              styles: {
                //page1
                content1: {
                  margin: [75, 5, 75, 0]
                },
                content2: {
                  margin: [75, 15, 0, 0]
                },
                content3: {
                  margin: [75, 0, 0, 0]
                },
                ttd: {
                  margin: [260, 5, 75, 0]
                },
                ttd2: {
                  margin: [260, 15, 75, 0]
                },
                p1: {
                  margin: [115, 5, 50, 0]
                },
                table: {
                  margin: [80, 5, 80, 0],
                  fontSize: 10,
                  //   alignment: 'justify'
                },
                //page2
                page2: {
                  margin: [0, 15, 0, 0]
                },
                headList: {
                  margin: [60, 15, 0, 0]
                },
                subList: {
                  margin: [75, 10, 0, 0]
                },
                List: {
                  margin: [90, 4, 0, 0]
                },
                ListSub: {
                  margin: [99, 4, 0, 0]
                },

                //page3
                headList2: {
                  margin: [60, 15, 0, 0]
                },
                subList2: {
                  margin: [105, 10, 0, 0]
                },

                //page4
                content1p4: {
                  margin: [75, 10, 0, 0]
                },
                table2: {
                  margin: [80, 15, 80, 0],
                  fontSize: 10,
                  //   alignment: 'justify'
                },
                ttdP4: {
                  margin: [300, 25, 75, 0]
                },
                ttd2P4: {
                  margin: [300, 50, 75, 0]
                },

                //page 5
                content1P5: {
                  margin: [75, 25, 75, 0]
                },
                content2P5: {
                  margin: [75, 7, 75, 0]
                },
                tableP5: {
                  margin: [80, 15, 80, 0],
                  fontSize: 10,
                  //   alignment: 'justify'
                },
                table2P5: {
                  margin: [70, 1, 0, 0],
                  fontSize: 10,
                  //   alignment: 'justify'
                },
                ttdP5: {
                  margin: [300, 50, 75, 0]
                },
                ttd2P5: {
                  margin: [300, 50, 75, 0]
                },
              },
            }

            const pdfDoc = pdfMake.createPdf(documentDefinition);
            pdfDoc.getBase64(async (data) => {
              let filename = "static/" + req.params.nim + '.pdf'
              const download = Buffer.from(data.toString('utf-8'), 'base64');
              fs.writeFile(await filename, download, 'base64', (error) => {
                if (error) throw error;
                res.redirect(301, "/" + req.params.nim + ".pdf")
              })
            })
          }).catch((err) => {
            console.log(err)
          });
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/exportexcel", (req, res) => {
    mhs
      .getAllTracer()
      .then(async (result) => {
        res.writeHead(200, {
          "Content-Disposition": 'attachment; filename="files.xlsx"',
          "Transfer-Encoding": "chunked",
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
        // var workbook = new excel.Workbook();
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
            style: { font: { name: "Arial Black" }, Bold: true },
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
            ttl: result[i].tempatLahir + "/" + result[i].tanggalLahir,
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
