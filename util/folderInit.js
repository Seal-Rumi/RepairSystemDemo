var fs = require("fs");

init = function () {
  var prom = new Promise((resolve, reject) => {
    let check_urls = [
      "./config",
      "./log",
      "./buffer",
      "./log",
      "./log/pg.error",
      "./data",
      "./include",
      "./media",
      "./media/img",
      "./media/font",
      "./model",
      "./router",
      "./src",
      "./styles",
      "./util",
      "./views",
    ];

    for (var k in check_urls) {
      if (!fs.existsSync(check_urls[k])) {
        fs.mkdirSync(check_urls[k]);
      }
    }

    //初始檔案判斷
    var initialFiles = [
      // './media/font/HanWangLiSuMedium_Regular.json',
      // './media/font/Microsoft_JhengHei_Regular.json',
    ];

    for (var k in initialFiles) {
      if (!fs.existsSync(initialFiles[k])) {
        console.log("Need " + initialFiles[k]);
        console.log("download model on ");
        // console.log('初始檔案並未條列所有項目，建議更新資料夾中所有檔案');
        process.exit(1);
      }
    }

    var default_file_check = [
      {
        url: "./config/ip.settle.json",
        content: `
                {
                    "allow": [
                        "*.*.*.*",
                        "1"
                    ]
                }
                `,
      },
      {
        url: "./config/pg.settle.json",
        content: `
                {
                    "online": {
                        "user": "postgres",
                        "host": "localhost",
                        "password": "",
                        "database": "manage_sys",
                        "port": 5432,
                        "idleTimeoutMillis": 3000
                    },
                    "offline": {
                        "user": "postgres",
                        "host": "localhost",
                        "password": "",
                        "database": "manage_sys",
                        "port": 5432,
                        "idleTimeoutMillis": 3000
                    }
                }
                `,
      },
      {
        url: "./config/connectInfo.json",
        content: `
        {
            "dev": {
                "main": {
                    "host": "localhost",
                    "port": "7000"
                },
                "db": {
                    "host": "localhost",
                    "port": "7001"
                }
            },
            "prod": {
                "main": {
                    "host": "218.161.12.9",
                    "port": "7000"
                },
                "db": {
                    "host": "218.161.12.9",
                    "port": "7001"
                }
            }
        }`,
      },
      {
        url: "./config/router_tk.settle.json",
        content: `
                {
                    "manage_api":{
                        "secret_key":"manage_api"
                    }
                }
                `,
      },
      {
        url: "./config/white_addr.json",
        content: `
                {
                    "manage_api":{
                        "offline":["::1", "127.0.0.1"],
                        "online":[]
                    }
                }
                `,
      },
    ];

    var proms = [];
    for (var k in default_file_check) {
      var prom_ = new Promise((resolve, reject) => {
        var url = default_file_check[k].url;
        var content = default_file_check[k].content;
        fs.exists(url, function (exists) {
          if (!exists) {
            fs.writeFile(url, content, (err) => {
              if (err) {
                throw err;
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      });

      proms.push(prom_);
    }

    Promise.allSettled(proms).then(function (res) {
      // console.log(res);
      resolve();
    });

    // resolve()
  });

  return prom;
};
exports.init = init;
// init()
