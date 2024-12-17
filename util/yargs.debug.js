var log = require("./log");
const $global = require("./global");
function show(argv, connectInfo) {
  $global.set("connectInfo", connectInfo);
  if (argv.debug) {
    log.todo(`Debug開啟`, true);
  } else {
    log.todo(`Debug關閉`, true);
  }
  const log_DEBUG = argv.debug;

  if (argv.dbtype) {
    log.todo("資料庫－單機連線模式", log_DEBUG);
  } else {
    log.todo("資料庫－線上連線模式", log_DEBUG);
  }

  if (argv.dev) {
    log.todo(`埠號－開發模式:${connectInfo.dev.main.port}`, log_DEBUG);
  } else {
    log.todo(`埠號－產品模式:${connectInfo.prod.main.port}`, log_DEBUG);
  }

  if (!argv.editMode) {
    log.todo(
      `認證開啟${connectInfo.dev.main.host}:${connectInfo.dev.main.port}`,
      log_DEBUG
    );
  } else {
    log.todo(`認證關閉`, log_DEBUG);
  }

  if (!argv.csrf) {
    log.todo(`csrf關閉`, log_DEBUG);
  } else {
    $global.set("csrf", true);
    log.todo(`csrf開啟`, log_DEBUG);
  }

  if (argv.help) {
    return yargs.showHelp();
  }
}

module.exports = {
  show: show,
};
