const judul = require("../model/judul");
const kompre = require("../model/kompre");
const munaqosah = require("../model/munaqosah");
const sempro = require("../model/sempro");
const { requestResponse } = require("../setup");

exports.daftar = (data) =>
  new Promise((resolve, reject) => {
    let key = data.key;

    console.log(data);
    if (key == "judul") {
      model = judul;
    } else if (key == "kompre") {
      model = kompre;
    } else if (key == "munaqosah") {
      model = munaqosah;
    } else if (key == "sempro") {
      model = sempro;
    }
    model
      .updateOne({ nim: data.nim }, data, { upsert: true })
      .then(() => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.cekJudul = (nim, key) =>
  new Promise((resolve, reject) => {
    if (key == "sempro") {
      model = judul;
    } else if (key == "kompre") {
      model = sempro;
    } else if (key == "munaqosah") {
      model = kompre;
    }
    model
      .findOne({ nim: nim })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.getAllPengajuan = (key, nidn) =>
  new Promise((resolve, reject) => {
    if (key == "judul") {
      model = judul;
    } else if (key == "kompre") {
      model = kompre;
    } else if (key == "munaqosah") {
      model = munaqosah;
    } else if (key == "sempro") {
      model = sempro;
    }
    model
      .find({ dosen: nidn })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.getPengumuman = (nim) =>
  new Promise((resolve, reject) => {
    var data = [];
    judul
      .findOne({ nim: nim })
      .then((juduls) => {
        if (juduls != null) {
          data.push(juduls);
        }
        sempro
          .findOne({ nim: nim })
          .then((sempros) => {
            if (sempros != null) {
              data.push(sempros);
            }
            munaqosah
              .findOne({ nim: nim })
              .then((munaqosahs) => {
                if (munaqosahs != null) {
                  data.push(munaqosahs);
                }
                kompre
                  .findOne({ nim: nim })
                  .then((kompres) => {
                    if (kompres != null) {
                      data.push(kompres);
                    }
                    resolve(data);
                  })
                  .catch((err) => reject(requestResponse.common_error));
              })
              .catch((err) => reject(requestResponse.common_error));
          })
          .catch((err) => reject(requestResponse.common_error));
      })
      .catch((err) => reject(requestResponse.common_error));
    // judul.aggregate([
    //   {$match : {
    //     nim : nim
    //   }},
    //   {
    //     $lookup: {
    //       from: "sempros",
    //       localField: "nim",
    //       foreignField: "nim",
    //       as: "sempro",
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "munaqosahs",
    //       localField: "nim",
    //       foreignField: "nim",
    //       as: "munaqosah",
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "kompres",
    //       localField: "nim",
    //       foreignField: "nim",
    //       as: "kompre",
    //     }
    //   }
    //   ,{
    //     $unwind: {
    //       path: "$sempro",
    //       "preserveNullAndEmptyArrays": true
    //     }
    //   },{
    //     $unwind: {
    //       path: "$munaqosah",
    //       "preserveNullAndEmptyArrays": true
    //     }
    //   },{
    //     $unwind: {
    //       path: "$kompre",
    //       "preserveNullAndEmptyArrays": true
    //     }
    //   }
    // ]).then((result) => {
    //         resolve(result);
    //       })
    //       .catch((err) => reject(requestResponse.common_error));
  });
