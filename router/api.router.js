const fs = require("fs");
const axios = require("axios");
const express = require("express");
const router = express.Router();
let connectInfo = require("../config/connectInfo.json");
const yargs = require("../util/yargs.main.js").yargs();
const argv = yargs.argv;
connectInfo = argv.dev ? connectInfo.dev : connectInfo.prod;

let baseURL = {
  to_db_api: `http://${connectInfo.db.host}:${connectInfo.db.port}`,
};

router.post("/", function (req, res) {
  res.json({ success: true, data: `this is api router` });
});
router.get("/", function (req, res) {
  res.json({ success: true, data: `this is api router` });
});
router.post("/test", function (req, res) {
  let data = req.body;
  console.log(`http://${connectInfo.host}:${connectInfo.port}`);
  axios({
    method: "POST",
    baseURL: `http://${connectInfo.host}:${connectInfo.port}`,
    url: "/",
    data,
  })
    .then((result) => {
      res.send({ success: true, data: 123 });
    })
    .catch((err) => {
      res.send({ success: false, data: null, error: `${err}` });
    });
});

router.post("/character/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/character/list",
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

// Image
router.post("/image/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/image/list",
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
router.post("/image/update", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/image/update",
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

// Model
router.post("/model/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/model/list",
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
router.post("/model/update", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/model/update",
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

// deviceType
router.post("/deviceType/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/deviceType/list",
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

// device
router.post("/device/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/device/list",
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

// workOrder
router.post("/workOrder/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/workOrder/list",
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
router.post("/workOrder/add", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/workOrder/add",
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
router.post("/workOrder/update", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/workOrder/update",
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
router.post("/workOrder/delete", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/workOrder/delete",
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

// issue
router.post("/issue/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/issue/list",
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

// staff
router.post("/staff/list", async function (req, res) {
  let data = req.body;
  let tk = await gettk({ baseURL: baseURL.to_db_api });
  axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/staff/list",
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

module.exports = router;
