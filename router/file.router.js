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
let outputFileName = "";
const storage_image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/mediaRepo/img"); // 儲存的目錄
  },
  filename: function (req, file, cb) {
    const originalExt = path.extname(file.originalname);
    const newFileName = `img_${new Date().getTime()}${originalExt}`;
    outputFileName = newFileName;
    cb(null, newFileName);
  },
});
const upload_image = multer({ storage: storage_image });

const storage_model = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/mediaRepo/model"); // 儲存的目錄
  },
  filename: function (req, file, cb) {
    const originalExt = path.extname(file.originalname);
    const newFileName = `glb_${new Date().getTime()}${originalExt}`;
    outputFileName = newFileName;
    cb(null, newFileName);
  },
});
const upload_model = multer({ storage: storage_model });
// 上傳圖片
router.post("/image/upload", upload_image.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    let tk = await gettk({ baseURL: baseURL.to_db_api });
    let send2db = {
      image_url: outputFileName, // 檔案名稱
      name: req.body.name || outputFileName, // 可以由前端傳入的名稱或直接使用檔案名稱
    };

    const result = await axios({
      method: "POST",
      baseURL: baseURL.to_db_api,
      url: "/db/image/add",
      data: send2db,
      headers: {
        Authorization: `Bearer ${tk.data}`,
      },
    });

    res.json({
      success: true,
      filename: req.file.filename,
      originalname: req.file.originalname,
      filepath: `/media/mediaRepo/img/${req.file.filename}`,
      outputFileName,
      dbResponse: result.data,
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      success: false,
      message: "Error uploading image or saving to database",
      error: err.message,
    });
  }
});
// 刪除圖片
router.post("/image/delete", async (req, res) => {
  let data = req.body;

  if (!data.image_uuid) {
    return res.status(400).json({
      success: false,
      message: "No image_uuid",
    });
  }

  let tk = await gettk({ baseURL: baseURL.to_db_api });

  await axios({
    method: "POST",
    baseURL: baseURL.to_db_api,
    url: "/db/image/delete",
    data: data,
    headers: {
      Authorization: `Bearer ${tk.data}`,
    },
  })
    .then((result) => {
      if (result.data.success) {
        // 構建本地檔案路徑
        let file = path.join(__dirname, `../media/mediaRepo/${data.image_url}`);

        // 刪除本地檔案
        fs.unlink(file, (err) => {
          if (err) {
            res.send({ success: false, err: "檔案刪除失敗" });
          } else {
            res.send({ success: true });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, err: "Database Error!" });
    });
});

// 上傳模型
router.post("/model/upload", upload_model.single("model"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    // 獲取存取資料庫的 Token
    let tk = await gettk({ baseURL: baseURL.to_db_api });
    
    // 定義要傳到資料庫的資料
    let send2db = {
      model_url: outputFileName, // 檔案名稱
      name: req.body.name || outputFileName, // 可以由前端傳入的名稱或直接使用檔案名稱
    };

    // 使用 Axios 發送資料到資料庫
    const result = await axios({
      method: "POST",
      baseURL: baseURL.to_db_api,
      url: "/db/model/add", // 注意修改為模型對應的資料庫路徑
      data: send2db,
      headers: {
        Authorization: `Bearer ${tk.data}`,
      },
    });

    // 成功上傳並存入資料庫後返回結果
    res.json({
      success: true,
      filename: req.file.filename,
      originalname: req.file.originalname,
      filepath: `/media/mediaRepo/models/${req.file.filename}`, // 修改路徑以存放模型檔案
      outputFileName,
      dbResponse: result.data,
    });
  } catch (err) {
    // 錯誤處理
    res.status(500).json({
      success: false,
      message: "Error uploading model or saving to database",
      error: err.message,
    });
  }
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
module.exports = router;
