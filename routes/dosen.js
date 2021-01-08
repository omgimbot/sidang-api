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
    const bitMap = fs.readFileSync('./static/pdf/uin.png', {encoding: 'base64'});
    return bitMap
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

  router.get("/exportpdf", (req, res) => {
      dosen
      .listMhsKompre()
      .then(async (result) => {

      var today = new Date();
      var arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
      var date = today.getDate()+' '+arrbulan[today.getMonth()]+' '+today.getFullYear();
      var dateDownload = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        
      //table page 1
        var header = [{
          fila_0:{
              col_1:{ text: 'NO', alignment: 'center'},
              col_2:{ text: 'Nama', alignment: 'center' },
              col_3:{ text: 'NPM', alignment: 'center' },
            
          },
          fila_1:{
              col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
              col_2:{ text: 'Header 2', style: 'tableHeader', alignment: 'center' }, 
              col_3:{ text: 'Header 3', style: 'tableHeader', alignment: 'center' },
            
          }
      }]
        var body = []
        
        for ( c in header){
                var headers = header[c];
                var row = new Array();
                row.push(headers.fila_0.col_1 )
                row.push( headers.fila_0.col_2)
                row.push( headers.fila_0.col_3)
                body.push(row);
        }
        let noP1 = 1
        for (x in result){
          var data = result[x];
          var row = new Array();
          row.push({text: noP1++, alignment: 'center'});
          row.push({text: data.nama, alignment: 'center'});
          row.push({text: data.nim, alignment: 'center'}); 
          body.push(row);
        }

    //table page 4

    var headerP41 = [{
          fila_0:{
              col_1:{rowSpan: 2, text: 'NO',alignment: 'center'},
              col_2:{rowSpan: 2, text: 'Nama Mahasiswa', alignment: 'center'},
              col_3:{rowSpan: 2, text: 'NPM', alignment: 'center'},
              col_4:{colSpan: 2, text: 'NILAI', alignment: 'center'},
              col_5:{text: '', alignment: 'center'},
              col_6:{rowSpan: 2, text: 'KET', alignment: 'center'},
            
          },
          fila_1:{
              col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
              col_2:{ text: 'Header 2', style: 'tableHeader', alignment: 'center' }, 
              col_3:{ text: 'Header 3', style: 'tableHeader', alignment: 'center' },
              col_4:{ text: 'Header 4', style: 'tableHeader', alignment: 'center' },
              col_5:{ text: 'Header 5', style: 'tableHeader', alignment: 'center' },
              col_6:{ text: 'Header 6', style: 'tableHeader', alignment: 'center' },
            
          }
      }]

    var headerP42 = [{
        fila_0:{
            col_1:{text: '',alignment: 'center'},
            col_2:{text: '', alignment: 'center'},
            col_3:{text: '', alignment: 'center'},
            col_4:{text: 'ANGKA', alignment: 'center'},
            col_5:{text: 'HURUF', alignment: 'center'},
            col_6:{text: '', alignment: 'center'},
          
        },
        fila_1:{
            col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
            col_2:{ text: 'Header 2', style: 'tableHeader', alignment: 'center' }, 
            col_3:{ text: 'Header 3', style: 'tableHeader', alignment: 'center' },
            col_4:{ text: 'Header 4', style: 'tableHeader', alignment: 'center' },
            col_5:{ text: 'Header 5', style: 'tableHeader', alignment: 'center' },
            col_6:{ text: 'Header 6', style: 'tableHeader', alignment: 'center' },
          
        }
    }]

    var bodyP4 = []
    
    for ( c in headerP41){
            var headers = headerP41[c];
            var row1 = new Array();
            row1.push(headers.fila_0.col_1 )
            row1.push( headers.fila_0.col_2)
            row1.push( headers.fila_0.col_3)
            row1.push(headers.fila_0.col_4 )
            row1.push( headers.fila_0.col_5)
            row1.push( headers.fila_0.col_6)
            bodyP4.push(row1);
    }
    for ( c in headerP42){
            var headers = headerP42[c];
            var row = new Array();
            row.push(headers.fila_0.col_1 )
            row.push( headers.fila_0.col_2)
            row.push( headers.fila_0.col_3)
            row.push(headers.fila_0.col_4 )
            row.push( headers.fila_0.col_5)
            row.push( headers.fila_0.col_6)
            bodyP4.push(row);
    }

    let noP4 = 1
    for (x in result){
      var data = result[x];
      var row = new Array();
      row.push({text: noP4++, alignment: 'center'});
      row.push({text: data.nama ,alignment: 'center'})
      row.push({text: data.nim, alignment: 'center'})
      row.push({text: '', alignment: 'center'})
      row.push({text: '', alignment: 'center'})
      row.push({text: '', alignment: 'center'})
      bodyP4.push(row);
    }

    var headerP51 = [{
        fila_0:{
            col_1:{ text: 'NO', alignment: 'center'},
            col_2:{ text: 'Nama Mahasiswa', alignment: 'center' },
            col_3:{ text: 'NPM', alignment: 'center' },
            col_4:{ text: 'Tanda Tangan', alignment: 'center' },
            col_5:{ text: 'KET', alignment: 'center' },
          
        },
        fila_1:{
            col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
            col_2:{ text: 'Header 2', style: 'tableHeader', alignment: 'center' }, 
            col_3:{ text: 'Header 3', style: 'tableHeader', alignment: 'center' },
            col_4:{ text: 'Header 4', style: 'tableHeader', alignment: 'center' },
            col_5:{ text: 'Header 5', style: 'tableHeader', alignment: 'center' },
          
        }
    }]

    var bodyP51 = []
    for ( c in headerP51){
            var headers = headerP51[c];
            var row = new Array();
            row.push( headers.fila_0.col_1)
            row.push( headers.fila_0.col_2)
            row.push( headers.fila_0.col_3)
            row.push( headers.fila_0.col_4)
            row.push( headers.fila_0.col_5)
            bodyP51.push(row);
    }
    let noP51 = 1
    let noTtd = 1
    for (x in result){
      var data = result[x];
      var row = new Array();
      row.push({text: noP51++, alignment: 'center'});
      row.push({text: data.nama, alignment: 'center'});
      row.push({text: data.nim, alignment: 'center'});
      row.push({text: noTtd++ +'.', alignment: 'left'})
      row.push({text: '', alignment: 'center'});
      bodyP51.push(row);
    }

    var documentDefinition = {
      pageSize: 'A4',
            content: [
              {
                image: 'data:image/png;base64,'+convertImageToBase64()+'',
                  width: '80',
                  margin: [ -20, 0, 0, -50 ],
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
                margin: [ 0, -10, 0, 0 ],
              },
              {
                text: [
                  'Bandar Lampung, ' + date,
                  ],
                fontSize: 11,
                alignment: 'right',
                margin: [ 5, 15, 75, 20 ]
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
                  'Kepada\nYth. Farida, S.Si.,MMSI.\nDosen Fakultas Tarbiyah dan Keguruan\nUIN Raden Intan Lampung',
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
                  'keterampilan'
                  ],
                style: 'content1',
                fontSize: 10,
                alignment: 'justify'
              },
              {
                text: [
                  'dalam perencanaan, proses, dan evaluasi pengajaran',
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
                style:'table',
                layout: '', // optional
                table: {
                  headerRows: 1,
                  widths: [ 20, 200, 120 ],
                  body: body
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
                  'Bandar Lampung, '+ date +'\nKetua Prodi,',
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
                bold:true,
                pageBreak: 'after'
              },
              
              //page2
              
              
              {
                image: 'data:image/png;base64,'+convertImageToBase64()+'',
                  width: '80',
                  margin: [ -20, 0, 0, -50 ],
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
                margin: [ 0, -10, 0, 0 ],
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
                image: 'data:image/png;base64,'+convertImageToBase64()+'',
                  width: '80',
                  margin: [ -20, 0, 0, -50 ],
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
                margin: [ 0, -10, 0, 0 ],
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
                image: 'data:image/png;base64,'+convertImageToBase64()+'',
                  width: '80',
                  margin: [ -20, 0, 0, -50 ],
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
                margin: [ 0, -10, 0, 0 ],
              },
              {
                text: 'DAFTAR NILAI KOMPREHENSIF',
                margin: [ 0, 20, 0, 0 ],
                fontSize: 18,
                bold: true,
                alignment: 'center'
              },
              {
                text: [
                  'Penguji                      : Farida, S. Si., M. Si',
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
                  'Bidang/Materi          : Kependidikan / Keterampilan dalam Perencanaan, Proses, dan',
                  ],
                style: 'content1p4',
                fontSize: 10,
              },
              {
                text: [
                  'Evaluasi Pengajaran',
                  ],
                margin: [ 170, 5, 0, 0 ],
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
                style:'table2',
                layout: '', // optional
                table: {
                  headerRows: 3,
                  widths: [ 20, 100, 60 , 50, 50, 40],
          
                  body: bodyP4
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
                  'Farida, S. Si., M. Si\nNIP. 197911282995011005 ',
                  ],
                style: 'ttd2P4',
                fontSize: 10,
                bold:true,
                pageBreak: 'after'
              },
              
              //page 5
              {
                image: 'data:image/png;base64,'+convertImageToBase64()+'',
                  width: '80',
                  margin: [ -20, 0, 0, -50 ],
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
                margin: [ 0, -10, 0, 0 ],
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
                style:'tableP5',
                layout: '', // optional
                table: {
                  headerRows: 2,
                  widths: [ 20, 100, 60 ,70, 70],
                  body: bodyP51
                }
              },
              {
                text: [
                  'TIM PENGUJI',
                  ],
                margin: [ 75, 25, 75, 0 ],
                fontSize: 12,
              },
              {
                style:'table2P5',
                layout: '', // optional
                table: {
                  headerRows: 1,
                  widths: [ 120, 90, 120, 80 ],
                  heights: [ 0, 60 ],
          
                  body: [
                    [{ text: 'Nama Penguji', bold: true },{ text: 'Bidang', bold: true },{ text: 'Materi', bold: true },{ text: 'Tanda Tangan', bold: true }],
                    [ 'Farida, S.Si.,MMSI.', 'Kependidikan', 'Keterampilan dalam\nPerencanaan, Proses, dannEvaluasi Pengajaran','']
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
                  'Komarudin, M.Pd',
                  ],
                style: 'ttd2P5',
                fontSize: 10,
                bold:true,
              },
            ],
            
            styles: {
                //page1
              content1: {
                  margin: [ 75, 5, 75, 0 ]
              },
              content2: {
                  margin: [ 75, 15, 0, 0 ]
              },
              content3: {
                  margin: [ 75, 0, 0, 0 ]
              },
              ttd: {
                  margin: [ 260, 5, 75, 0 ]
              },
              ttd2: {
                  margin: [ 260, 15, 75, 0 ]
              },
              p1: {
                  margin: [ 115, 5, 50, 0 ]
              },
              table: {
                  margin: [ 80, 5, 80, 0 ],
                  fontSize: 10,
                //   alignment: 'justify'
              },
              //page2
              page2: {
                  margin: [ 0, 15, 0, 0 ]
              },
              headList: {
                  margin: [ 60, 15, 0, 0 ]
              },
              subList: {
                  margin: [ 75, 10, 0, 0 ]
              },
              List: {
                  margin: [ 90, 4, 0, 0 ]
              },
              ListSub: {
                  margin: [ 99, 4, 0, 0 ]
              },
              
              //page3
              headList2: {
                  margin: [ 60, 15, 0, 0 ]
              },
              subList2: {
                  margin: [ 105, 10, 0, 0 ]
              },
              
              //page4
              content1p4: {
                  margin: [ 75, 10, 0, 0 ]
              },
              table2: {
                  margin: [ 80, 15, 80, 0 ],
                  fontSize: 10,
                //   alignment: 'justify'
              },
              ttdP4: {
                  margin: [ 300, 25, 75, 0 ]
              },
              ttd2P4: {
                  margin: [ 300, 50, 75, 0 ]
              },
              
              //page 5
              content1P5: {
                  margin: [ 75, 25, 75, 0 ]
              },
              content2P5: {
                  margin: [ 75, 7, 75, 0 ]
              },
              tableP5: {
                  margin: [ 80, 15, 80, 0 ],
                  fontSize: 10,
                //   alignment: 'justify'
              },
              table2P5: {
                  margin: [ 70, 1, 0, 0 ],
                  fontSize: 10,
                //   alignment: 'justify'
              },
              ttdP5: {
                  margin: [ 350, 50, 75, 0 ]
              },
              ttd2P5: {
                  margin: [ 350, 50, 75, 0 ]
              },
          },
      
    }

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data)=>{
        res.writeHead(200, 
        {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="Surat-Tugas-'+dateDownload+'.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
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
        var workbook = new ExcelJS.stream.xlsx.WorkbookWriter({stream : res});
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
