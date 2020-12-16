const judul = require("../model/judul");
const kompre = require("../model/kompre");
const munaqosah = require("../model/munaqosah");
const mk = require("../model/mataKuliah");
const sempro = require("../model/sempro");
const penguji = require("../model/penguji");
const pengujiMhs = require("../model/pengujiMhs");
const { requestResponse } = require("../setup");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.inputPengujiMhs = (data) =>
  new Promise((resolve, reject) => {
    pengujiMhs
      .create(data)
      .then(() => resolve(requestResponse.common_success))
      .catch((err) => reject(console.log(err)));
  });

exports.getListPengujiMhs = (nim) =>
  new Promise((resolve, reject) => {
    pengujiMhs
      .aggregate([
        {
          $match: {
            nim: nim,
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk1",
            foreignField: "nim",
            as: "Mk1",
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk2",
            foreignField: "nim",
            as: "Mk2",
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk3",
            foreignField: "nim",
            as: "Mk3",
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk4",
            foreignField: "nim",
            as: "Mk4",
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk5",
            foreignField: "nim",
            as: "Mk5",
          },
        },
        {
          $lookup: {
            from: "pengujis",
            localField: "mk6",
            foreignField: "nim",
            as: "Mk6",
          },
        },
        { $unwind: { path: "$Mk1", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Mk2", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Mk3", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Mk4", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Mk5", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$Mk6", preserveNullAndEmptyArrays: true } },
      ])
      .then((dataPengujiMhs) => {
        resolve(dataPengujiMhs);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.inputPenguji = (data) =>
  new Promise((resolve, reject) => {
    penguji
      .create(data)
      .then(() => resolve(requestResponse.common_success))
      .catch((err) => reject(console.log(err)));
  });

exports.updatePenguji = (data, id) =>
  new Promise((resolve, reject) => {
    try {
      penguji
        .updateOne(
          {
            _id: ObjectId(id),
          },
          { $set: data }
        )
        .then(() => resolve(requestResponse.common_success))
        .catch((err) => reject(console.log(err)));
    } catch (err) {
      console.log(err);
    }
  });

exports.getListPenguji = () =>
  new Promise((resolve, reject) => {
    penguji
      .aggregate([
        {
          $lookup: {
            from: "matakuliahs",
            localField: "kodeMk",
            foreignField: "kodeMk",
            as: "mk",
          },
        },
        { $unwind: "$mk" },
      ])
      .then((dataPenguji) => {
        resolve(dataPenguji);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.hapusPenguji = (id) =>
  new Promise((resolve, reject) => {
    // console.log(id)
    try {
      penguji
        .deleteOne({
          _id: ObjectId(id),
        })
        .then(() => {
          // console.log(e)
          resolve(requestResponse.common_delete);
        })
        .catch(() =>
          reject(
            // console.log(err)
            requestResponse.common_error
          )
        );
    } catch (err) {
      console.log(err);
    }
  });

exports.inputMk = (data) =>
  new Promise((resolve, reject) => {
    // console.log(data)
    mk.create(data)
      .then(() => resolve(requestResponse.common_success))
      .catch((err) => reject(console.log(err)));
  });

exports.getListMk = () =>
  new Promise((resolve, reject) => {
    var mysort = { created_at: -1 };
    mk.find({})
      .sort(mysort)
      .then((mataKuliah) => {
        resolve(mataKuliah);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.acc = (value) =>
  new Promise((resolve, reject) => {
    let key = value.key;
    console.log(value);
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
      .updateOne({ nim: value.nim }, value)
      .then(() => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.tolak = (nim, status, key) =>
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
      .updateOne({ nim: nim }, { status: status })
      .then(() => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });
