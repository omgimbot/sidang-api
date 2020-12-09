const judul = require("../model/judul");
const kompre = require("../model/kompre");
const munaqosah = require("../model/munaqosah");
const mk = require("../model/mataKuliah");
const sempro = require("../model/sempro");
const penguji = require("../model/penguji");
const { requestResponse } = require("../setup");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

exports.inputPenguji = (data) =>
  new Promise((resolve, reject) => {
    // console.log(data)
      penguji
        .create(data)
          .then(() => resolve(
            requestResponse.common_success
          )).catch((err) => reject(
            console.log(err)
          ))
  })

  exports.getListPenguji = () =>
    new Promise((resolve, reject) => {
      penguji.aggregate([
              {
                $lookup:
                    {
                        from: "matakuliahs",
                        localField: "kodeMk",
                        foreignField: "kodeMk",
                        as: "mk"
                    }
              },
            { $unwind:'$mk' }])
        .then((dataPenguji) => {
          resolve(dataPenguji);
        })
        .catch((err) => reject(requestResponse.common_error))
        
    });

  exports.hapusPenguji = (id) =>
  new Promise((resolve, reject) => {
    console.log(id)
      try {
        penguji
        .deleteOne({
          _id: ObjectId(id)
        })
          .then((e) => {
            console.log(e)
            resolve(requestResponse.common_success)
          })
          .catch((err) => reject(
            console.log(err)
          ))
      } catch (err) {
        console.log(err)
      }
  })

  exports.inputMk = (data) =>
  new Promise((resolve, reject) => {
    // console.log(data)
    mk
      .create(data)
      .then(() => resolve(
        requestResponse.common_success
        ))
      .catch((err) => reject(
        console.log(err)
        ));
  })

  exports.getListMk = () =>
  new Promise((resolve, reject) => {
    mk
      .find({})
      .then((mataKuliah) => {
        resolve(mataKuliah);
      })
      .catch((err) =>
        reject(requestResponse.common_error)
      );
  });

  exports.acc = (value) =>
  new Promise((resolve, reject) => {
    let key = value.key
    console.log(value)
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
      .updateOne({nim : value.nim},value)
      .then(() => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

  exports.tolak = (nim,status,key) =>
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
      .updateOne({nim : nim},{status:status})
      .then(() => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });
