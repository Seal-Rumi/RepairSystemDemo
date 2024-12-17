const crypto = require("crypto");
const http = require("http");
var express = require("express");
var session = require("express-session");

const folderInit = require("./util/folderInit.js");
folderInit.init().then(() => {
  const white_addr = require("./config/white_addr.json");
  const router_tk = require("./config/router_tk.settle.json");
  const pgControl = require("./util/pg.controller.js");
  const jwt = require("./util/jwt.js");
  const yargs = require("./util/yargs.db.js").yargs();
  var argv = yargs.argv;
  let connectInfo = require("./config/connectInfo.json");
  connectInfo = argv.dev ? connectInfo.dev : connectInfo.prod;

  var app = express();
  const server0 = http.createServer(app);
  app.engine("html", require("express-art-template"));
  app.set("view engine", "ejs");
  //加載body-parser:
  var bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  //直接讀取檔案
  app.use(express.static(__dirname));
  app.use("/node_modules/", express.static("./node_modules/"));

  app.post("/get_token", (req, res) => {
    res.send(
      jwt.ptk_encode({
        payload: {
          info: getSHA256ofJSON(req.ip),
        },
        secret_key: router_tk.manage_api.secret_key,
      })
    );
    function getSHA256ofJSON(input) {
      return crypto
        .createHash("sha256")
        .update(JSON.stringify(input))
        .digest("hex");
    }
  });

  /**
   * 資安關卡
   * 1. IP whitelist
   * 2. csurf 認證
   * 3. 密鑰認證
   */
  if (argv.dev) {
    app.use((req, res, next) => {
      let whitelist = white_addr.manage_api.offline;
      if (whitelist.includes(req.ip)) next();
      else {
        res.status(403).send("Access forbidden");
      }
    });

    app.use(verify);

    app.use(function (req, res, next) {
      res.header("Access-Controd0l-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.use(
      session({
        secret: "backstage", // 對session id 相關的cookie 進行簽名
        resave: true,
        rolling: true,
        // name: 'name',
        saveUninitialized: true, // 是否儲存未初始化的會話
        cookie: {
          // maxAge: 1000 * 60 * 60, // 設定 session 的有效時間，單位毫秒
          secure: false,
          httpOnly: true,
          // sameSite: 'strict',
        },
      })
    );
  } else {
    app.use((req, res, next) => {
      let whitelist = white_addr.manage_api.online;
      if (whitelist.includes(req.ip)) next();
      else {
        res.status(403).send("Access forbidden");
      }
    });
    app.use(
      csurf({
        cookie: {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        },
      })
    );
    app.use(verify);

    app.use(
      session({
        secret: "backstage", // 對session id 相關的cookie 進行簽名
        resave: false,
        rolling: true,
        name: "name",
        saveUninitialized: true, // 是否儲存未初始化的會話
        cookie: {
          maxAge: 1000 * 60 * 30, // 設定 session 的有效時間，單位毫秒
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      })
    );
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Origin",
        `${connectInfo.host}:${connectInfo.port}`
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      // res.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
      next();
    });
  }
  // set Router
  let dbRouter = require("./router/db.router");
  app.use("/db", dbRouter);

  // PG
  databaseInit();
  async function databaseInit() {
    console.log("databaseInit 初始化");
    let logObj = {};
    const pgCheck = require("./util/pg.check.js");
    var Pool = await pgControl.init(argv.dev);
    pgCheck.system(Pool);
    pgCheck.asset(Pool);
    pgCheck.maintenance(Pool);
  }

  argv.port = argv.dev ? connectInfo.db.port : connectInfo.db.port;
  var server = server0.listen(
    argv.port,
    argv.public ? undefined : "localhost",
    function () {
      if (argv.public) {
        console.log(
          "server running publicly.  Connect to http://localhost:%d/",
          server.address().port
        );
      } else {
        console.log(
          "server running locally.  Connect to http://localhost:%d/",
          server.address().port
        );
      }
    }
  );

  async function verify(req, res, next) {
    const bearerHeaer = req.headers["authorization"];
    if (typeof bearerHeaer != "undefined") {
      const bearer = bearerHeaer.split(" ");
      const bearerToken = bearer[1];
      var jwt_res = jwt.ptk_decode(
        bearerToken,
        router_tk.manage_api.secret_key
      );
      // console.log(jwt_res.payload);
      if (jwt_res.success) {
        next();
      } else {
        res
          .status(403)
          .send({ success: false, content: "Authentication token Error" });
      }
    } else {
      res
        .status(403)
        .send({ success: false, content: "Authentication token Error" });
      return;
    }
  }
});
