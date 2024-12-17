const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
let connectInfo = require("../config/connectInfo.json");
const yargs = require("../util/yargs.main.js").yargs();
const argv = yargs.argv;
connectInfo = argv.dev ? connectInfo.dev : connectInfo.prod;
let baseURL = {
  to_db_api: `http://${connectInfo.db.host}:${connectInfo.db.port}`,
};

router.post("/", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/",
    data,
    headers: {
      Authorization: `Bearer ${tk.data}`,
    },
  })
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      router_catch_send(req, res, err);
    });
});
function gettk({ type = null, baseURL = "", data = null }) {
  return new Promise((reslove, reject) => {
    axios({
      method: "POST",
      baseURL,
      url: "/get_token",
      data,
    })
      .then((result) => {
        reslove({ success: true, data: result.data });
      })
      .catch((err) => {
        reslove({ success: false, data: null, errorCode: 3 });
      });
  });
}
function router_catch_send(req, res, err) {
  if (err.response) {
    error_recode(err.response.data);
    res.status(err.response.status).send({
      success: false,
      data: null,
      error: `${err.response.data}`,
      errorCode: 2,
    });
  } else if (err.request) {
    // console.log(err.request);
    error_recode(err.request);
    res.status(500).send({ success: false, data: null, errorCode: 2 });
  } else {
    error_recode(err.message);
    console.log(err.message);
    res.status(500).send({
      success: false,
      data: null,
      error: `${err.message}`,
      errorCode: 2,
    });
  }
  function error_recode(error) {
    let thisDate = new Date().toLocaleString("zh-TW");
    let folder = thisDate.split(" ")[0].split("/").join("_");
    if (!fs.existsSync(`./log/router.error/${folder}`)) {
      fs.writeFileSync(`./log/router.error/${folder}`, "", (err) => {});
    }
    let error_log = `=====${thisDate}=====\n${error}\n`;
    fs.appendFileSync(`./log/router.error/${folder}`, error_log, (err) => {});
  }
}
module.exports = router;
