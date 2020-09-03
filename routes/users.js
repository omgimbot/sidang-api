"use strict";
const auth = require("basic-auth");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const userController = require("../controller/user_controller");
var config = require("../config/config.json");
const fs = require("fs");
const uploadUtil = require("../utilities/uploadImg");
const { requestResponse } = require("../setup");
const reqResponse = require("../setup");

module.exports = (router) => {
  router.get("/", (req, res) => res.end("Kartu petani berjaya !"));

  router.post("/users/signin", (req, res) => {
    const credentials = auth(req);
    if (!credentials) {
      res.status(400).json({ rm: "Invalid Request !" });
    } else {
      userController
        .loginUser(credentials.name, credentials.pass)
        .then((result) => {
          const token = jwt.sign(result, config.secret, { expiresIn: 1000000 });
          let username = result.message;
          console.log(username);
          userController
            .getProfile(username)
            .then((result) => {
              res.json(result);
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
    }
  });


  router.post("/users/signup", (req, res) => {
    // const userProfile = req.files['user_photo']
    // if (userProfile !== undefined) {
    // 	Object.assign(req.body, {
    // 		user_photo: userProfile[0].filename
    // 	})
    // }
    // console.log(nik,nama,no_hp,role,password,token,user_photo,ktp_photo,kk_photo)
    userController
      .registerUser(req.body)
      .then((result) => {
        // if (userProfile !== undefined) {
        // 	ftp.sendToFtp(userProfile[0].path, 'user', userProfile[0].filename)
        // }
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  });


  router.get("/listdosen", (req, res) => {
    
      userController
        .getListDosen()
        .then((result) => res.json(result))
        .catch((err) => res.status(err.status).json({ message: err.message }));
  
    
  });




  router.post("/users/checkToken", (req, res) => {
    const email = req.body.email;
    const token = req.headers["x-access-token"];
    userController
      .checkToken(email, token)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => res.json(err));
  });






};
