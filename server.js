/*eslint-env node*/
"use strict";
var fs = require("fs");
var path = require("path");

const folderInit = require("./util/folderInit.js");
folderInit.init().then(async function () {
  fs.readFile("./config/connectInfo.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const connectInfo = JSON.parse(data);
      (function () {
        var express = require("express");
        var compression = require("compression");
        const ipfilter = require("express-ipfilter").IpFilter;
        var IpDeniedError = require("express-ipfilter").IpDeniedError;
        var domain = require("domain");
        var session = require("express-session");
        var cookieParser = require("cookie-parser");
        var bodyParser = require("body-parser");
        const helmet = require("helmet");
        const nocache = require("nocache");

        // 參數載入、查看
        const yargs = require("./util/yargs.main.js").yargs();
        const argv = yargs.argv;
        require("./util/yargs.debug.js").show(argv, connectInfo);

        const port = argv.dev
          ? connectInfo.dev.main.port
          : connectInfo.prod.main.port;
        // var socket_io = null

        var mime = express.static.mime;
        mime.define(
          {
            "application/json": ["czml", "json", "geojson", "topojson"],
            "application/wasm": ["wasm"],
            "image/crn": ["crn"],
            "image/ktx": ["ktx"],
            "model/gltf+json": ["gltf"],
            "model/gltf-binary": ["bgltf", "glb"],
            "application/octet-stream": [
              "b3dm",
              "pnts",
              "i3dm",
              "cmpt",
              "geom",
              "vctr",
            ],
            "text/plain": ["glsl"],
          },
          true
        );

        var app = express();
        app.disable("x-powered-by");
        app.set("trust proxy", "loopback");
        app.engine("html", require("express-art-template"));
        app.set("view engine", "ejs");

        // app.use(bodyParser.urlencoded({
        //     extended: false
        // }));
        // app.use(bodyParser.json());

        app.use(function (req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
          );
          next();
        });

        app.use(express.static(__dirname));

        app.use("/template", express.static(__dirname + "/views/template"));

        const ips = require("./config/ip.settle.json").allow;
        app.use(
          ipfilter(/*ips,*/ { filter: ips, detectIp: getIp, mode: "allow" })
        );
        function getIp(req) {
          return (req.headers["x-forwarded-for"] || req.socket.remoteAddress)
            .split(":")
            .pop();
        }
        app.use(function (err, req, res, _next) {
          if (err instanceof IpDeniedError) {
            res.send("Access Denied");
          } else {
            res.status(err.status || 500).end();
          }
        });
        app.use(helmet.frameguard({ action: "SAMEORIGIN" }));
        app.use(compression());
        // app.use(express.json({ limit: "500mb" }));
        // app.use(express.urlencoded({ limit: "1024mb", extended: false }));
        app.use(bodyParser.json({ limit: "5000mb" }));
        app.use(bodyParser.urlencoded({ limit: "5000mb", extended: true }));
        app.use(nocache());
        // 新增
        var l0g = require("./util/log");
        if (argv.editMode) {
          l0g.warn("==非SSL模式==", true);
          connectInfo = { host: "http://localhost", port: argv.port };
          app.use(function (req, res, next) {
            let star = "*";
            res.header("Access-Control-Allow-Origin", star);
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
          });
          app.use(
            session({
              secret: "abcd",
              resave: true,
              rolling: true,
              saveUninitialized: true,
              cookie: {
                maxAge: 1000 * 60 * 30,
                secure: !argv.editMode,
                httpOnly: true,
              },
            })
          );
        } else {
          l0g.warn("==SSL模式==", true);
          app.use(helmet.frameguard({ action: "SAMEORIGIN" }));
          l0g.warn(`${connectInfo.host}:${connectInfo.port}`, true);
          app.use(
            session({
              secret: "secret",
              resave: true,
              rolling: true,
              name: "name",
              saveUninitialized: true,
              cookie: {
                maxAge: 1000 * 60 * 30,
                secure: !argv.editMode,
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
            next();
          });
        }
        app.use("/files", express.static(path.join(__dirname, "public")));
        var appRouter = require("./router/app.router.js");
        app.use("/app", appRouter);
        var apiRouter = require("./router/api.router.js");
        app.use("/api", apiRouter);
        var fileRouter = require("./router/file.router.js");
        app.use("/file", fileRouter);

        app.use("/config", express.static("config"));
        app.use("/include", express.static("include"));
        app.use("/logs", express.static("logs"));
        app.use("/media", express.static("media"));
        app.use("/model", express.static("model"));
        app.use("/font", express.static(__dirname + "/font"));
        app.use("/node_modules", express.static("node_modules"));
        app.use("/src", express.static("src"));
        app.use("/styles", express.static("styles"));
        app.use("/upload", express.static("upload"));
        app.use("/data", express.static("data"));
        app.use("/libs", express.static("libs"));
        app.use(function (req, res, next) {
          var reqDomain = domain.create();
          reqDomain.on("error", async function () {
            try {
              console.log("server close1");
              var killTimer = setTimeout(function () {
                process.exit(1);
              }, 30000);
              // await pgControl.audit.app.shutdown({ uuid: uuidv4(), app_url: '無預警關閉' });
              killTimer.unref();
              server.close();
              res.send(500);
            } catch (e) {
              console.log("error when exit", e.stack);
            }
          });
          reqDomain.run(next);
        });

        app.get("/proxy/*", function (req, res /*, next*/) {
          // look for request like http://localhost:8080/proxy/http://example.com/file?query=1
          var remoteUrl = getRemoteUrlFromParam(req);
          if (!remoteUrl) {
            // look for request like http://localhost:8080/proxy/?http%3A%2F%2Fexample.com%2Ffile%3Fquery%3D1
            remoteUrl = Object.keys(req.query)[0];
            if (remoteUrl) {
              remoteUrl = url.parse(remoteUrl);
            }
          }

          if (!remoteUrl) {
            return res.status(400).send("No url specified.");
          }

          if (!remoteUrl.protocol) {
            remoteUrl.protocol = "http:";
          }

          var proxy;
          if (upstreamProxy && !(remoteUrl.host in bypassUpstreamProxyHosts)) {
            proxy = upstreamProxy;
          }

          // encoding : null means "body" passed to the callback will be raw bytes

          request.get(
            {
              url: url.format(remoteUrl),
              headers: filterHeaders(req, req.headers),
              encoding: null,
              proxy: proxy,
            },
            function (error, response, body) {
              var code = 500;

              app.get("/index", function (req, res) {
                res.render(__dirname + "/views/index.ejs", {
                  // ver: 'v1.0'
                });
              });

              res.status(code).send(body);
            }
          );
        });
        app.get("/", function (req, res /*, next*/) {
          res.send({ content: "請輸入靜態路徑" });
        });

        // app.get('/getdata', async (req, res) => {
        //   server_db.queryData_gpu
        // });

        // get telegraf data---
        // const queries = [
        //   "SELECT load5 FROM system ORDER BY time desc limit 1",
        //   "SELECT used_percent FROM disk WHERE device = 'C:' ORDER BY time desc LIMIT 1",
        // ];
        // const fetchData = () => {
        //   return new Promise(async (resolve, reject) => {
        //     console.log("fetchData");
        //     const inf = new Influx.InfluxDB(config.offline)
        //     // console.log("inf", inf);

        //     inf.query(queries)
        //       .then(rows => {
        //         // console.log("queries results:", rows);
        //         resolve({ success: true, data: rows });
        //         const jsonData = JSON.stringify(rows);
        //         resolve({ success: true, data: jsonData });
        //       })
        //       .catch(error => {
        //         console.error("Query error:", error);
        //         reject({ success: false, error });
        //       });

        //     return
        //   });
        // }

        // app.get('/getdata', async (req, res) => {
        //   console.log("getdata");

        //   fetchData()
        //     .then(data => res.json(data))
        //     .catch(error => res.status(500).send(error));
        // });
        // ---get telegraf data

        async function databaseInit() {
          console.log("databaseInit 初始化");
          let logObj = {};
          const pgControl = require("./util/pg.controller.js");
          const pgCheck = require("./util/pg.check.js");
          var Pool = await pgControl.init();
          // logObj["account"] = await pgCheck.table.account(Pool);
          // logObj["LOG"] = await pgCheck.table.LOG(Pool);
          // logObj["LIST"] = await pgCheck.table.LIST(Pool);
          // logObj["LIGHT"] = await pgCheck.table.LIGHT(Pool);
          // logObj["PICTOGRAM"] = await pgCheck.table.PICTOGRAM(Pool);
          // logObj["MAPSET"] = await pgCheck.table.MAPSET(Pool);
          // logObj["STYLESET"] = await pgCheck.table.STYLESET(Pool);
          // logObj["RTSPLIST"] = await pgCheck.table.RTSPLIST(Pool);
          // logObj["CCTV"] = await pgCheck.table.CCTV(Pool);
          // logObj["GENMDL"] = await pgCheck.table.GENMDL(Pool);
          // logObj["ICON"] = await pgCheck.table.ICON(Pool);
          // logObj["TC"] = await pgCheck.table.TC(Pool);
          // logObj["RSU"] = await pgCheck.table.RSU(Pool);
          // logObj["signal_save"] = await pgCheck.table.signal_save(Pool);
          // logObj["BUS"] = await pgCheck.table.BUS(Pool);
          // logObj["NTDLRT"] = await pgCheck.table.NTDLRT(Pool);
          // logObj["STPM"] = await pgCheck.table.STPM(Pool);
          // logObj["PIPELINE"] = await pgCheck.table.PIPELINE(Pool);
          // wlog("./log/pgCheck.json", JSON.stringify(logObj))
        }
        // databaseInit();

        async function verify(req, res, next) {
          const bearerHeaer = req.headers["authorization"];
          if (typeof bearerHeaer != "undefined") {
            const bearer = bearerHeaer.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            var jwt_res = jwt.decode(req.token);
            // console.log(jwt_res.payload);
            if (jwt_res.success) {
              if (
                jwt_res.result.payload.user_name == "danhai" ||
                jwt_res.result.payload.user_name == "admin"
              ) {
                next();
              } else {
                res.send({
                  success: false,
                  content: "Authentication token Error",
                });
                return;
              }
            } else {
              res.send({
                success: false,
                content: "Authentication token Error",
              });
              return;
            }
          } else {
            res.send({ success: false, content: "Authentication token Error" });
            return;
          }
        }

        var dontProxyHeaderRegex =
          /^(?:Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade)$/i;
        var upstreamProxy = argv["upstream-proxy"];
        function getRemoteUrlFromParam(req) {
          var remoteUrl = req.params[0];
          if (remoteUrl) {
            if (!/^https?:\/\//.test(remoteUrl)) {
              remoteUrl = "http://" + remoteUrl;
            }
            remoteUrl = url.parse(remoteUrl);
            remoteUrl.search = url.parse(req.url).search;
          }
          return remoteUrl;
        }
        function filterHeaders(req, headers) {
          var result = {};
          // filter out headers that are listed in the regex above
          Object.keys(headers).forEach(function (name) {
            if (!dontProxyHeaderRegex.test(name)) {
              result[name] = headers[name];
            }
          });
          return result;
        }

        // const socket_case = new api_socket_io.socket_set();
        var server = app.listen(
          port,
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
        process.on("uncaughtException", async function (err) {
          console.log("uncaughtException");
          // log.info(err, true);
          console.log(err, true);
          // log.stop();
          try {
            console.log("server close2");
            var killTimer = setTimeout(function () {
              process.exit(1);
            }, 30000);
            // await pgControl.audit.app.shutdown({ uuid: uuidv4(), app_url: '無預警關閉' });
            killTimer.unref();
            server.close();
          } catch (e) {
            console.log("error when exit", e.stack);
          }
        });
        var isFirstSig = true;
        process.on("SIGINT", function () {
          if (isFirstSig) {
            console.log("server shutting down.");
            server.close(function () {
              process.exit(0);
            });
            isFirstSig = false;
          } else {
            console.log("server force kill.");
            process.exit(1);
          }
        });
        server.on("error", function (e) {
          if (e.code === "EADDRINUSE") {
            console.log(
              "Error: Port %d is already in use, select a different port.",
              port
            );
            console.log("Example: node server.js --port %d", port + 1);
          } else if (e.code === "EACCES") {
            console.log(
              "Error: This process does not have permission to listen on port %d.",
              port
            );
            if (port < 1024) {
              console.log("Try a port number higher than 1024.");
            }
          }
          console.log(e);
          process.exit(1);
        });
        server.on("close", function () {
          console.log("server stopped.");
        });
      })();
    }
  });
});
