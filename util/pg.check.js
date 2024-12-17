const config = require("../config/pg.settle.json");
const udtcloumn = require("../data/map.udtcloumn.json");
const fs = require("fs");
const $pg = require("./pg.query.js");
const log = require("./log");
const log_DEBUG = true;

function udt_name_list(udtKey, key) {
  let udt_nameMap = udtcloumn;
  let elem = udt_nameMap[udtKey];
  if (elem) {
    return elem.indexOf(key) !== -1;
  } else {
    return false;
  }
}
function _tableCheck(Pool, tbName, sqlStr) {
  var prom = new Promise((resolve, reject) => {
    var newsqlStr = sqlStr.replace(/@@@/i, tbName);
    // console.log(newsqlStr);
    $pg.query(Pool, newsqlStr).then(function (res) {
      log.info(`${tbName} 資料表檢查OK`, log_DEBUG);
      resolve({ text: `${tbName} 資料表檢查OK`, res: res });
    });
  });
  return prom;
}
function __schemaCheck_rm(text, wordToRemove) {
  const inputString = text;
  const regex = new RegExp(`\\b${wordToRemove}\\b`, "g");
  const resultString = inputString.replace(regex, "").trim();
  return resultString;
}
function __schemaCheck_num(inputString) {
  const regex = /(\w+)\((\d+)\)/;

  const match = inputString.match(regex);
  const resultArray = match ? [parseInt(match[2]), match[1]] : null;
  return resultArray;
}
function _schemaQuery(Pool, tbName) {
  var prom = new Promise((resolve, reject) => {
    var newsqlStr = `SELECT
        column_name,
            udt_name,
            character_maximum_length,
            data_type
        FROM
        information_schema.columns
        WHERE
        table_name = '${tbName.toLowerCase()}';`;
    $pg.query(Pool, newsqlStr).then(function (res) {
      // log.info(`${tbName} 資料表檢查OK`, log_DEBUG);
      resolve({ text: `${tbName} 資料表詮釋查詢OK`, res: res });
    });
  });
  return prom;
}
function _schemaCheck(schemaContent) {
  let arr = schemaContent.split("\n");
  arr.shift();
  arr.shift();
  arr.pop();
  arr.pop();
  // console.log(arr);
  let obj = {};
  for (let k in arr) {
    let item = arr[k].trim();
    let meta = [];
    // 去除關鍵字
    item = __schemaCheck_rm(item, "Primary KEY");
    item = __schemaCheck_rm(item, "UNIQUE");
    // 去除 ,
    const regex = /,/g;
    item = item.replace(regex, "").trim();
    item = item.split(" ");
    meta[0] = item[0].toLowerCase();

    if (item[1]) {
      let tmp = __schemaCheck_num(item[1]);
      if (tmp) {
        meta[1] = tmp[1];
        meta[2] = tmp[0];
      } else {
        meta[1] = item[1];
      }
    }
    // console.log(meta);
    obj[meta[0]] = meta;
  }
  return obj;
}
function schemaCompare(tbName, currentSchema, aimSchema) {
  let errorStack = [];
  for (let k in currentSchema) {
    if (!aimSchema[k]) {
      errorStack.push(`${tbName}表缺少${currentSchema[k]}欄位`);
    } else {
      // console.log(currentSchema[k]);
      // console.log(currentSchema[k].character_maximum_length == null);
      if (currentSchema[k].character_maximum_length == null) {
        if (currentSchema[k].udt_name !== aimSchema[k][1]) {
          if (!udt_name_list(currentSchema[k].udt_name, aimSchema[k][1])) {
            errorStack.push(
              `${tbName}表${k}欄屬性不同(${currentSchema[k].udt_name}／${aimSchema[k][1]} ref:${currentSchema[k].data_type}})`
            );
          } else {
            log.todo(
              `${tbName}表${k}欄屬性不同(${currentSchema[k].udt_name}／${aimSchema[k][1]} ref:${currentSchema[k].data_type}})`
            );
          }
        }
      } else {
        log.todo(
          `${tbName}表${k}欄容量check(${currentSchema[k].character_maximum_length}／${aimSchema[k][2]})`,
          true
        );
        if (currentSchema[k].udt_name !== aimSchema[k][1]) {
          errorStack.push(
            `*${tbName}表${k}欄屬性不同(${currentSchema[k].udt_name}／${aimSchema[k][1]} ref:${currentSchema[k].data_type}})`
          );
          errorStack.push(
            `容量大小：(${currentSchema[k].character_maximum_length}／${aimSchema[k][2]})`
          );
        }
        if (currentSchema[k].character_maximum_length !== aimSchema[k][2]) {
          errorStack.push(
            `${tbName}表${k}欄容量不同(${currentSchema[k].character_maximum_length}／${aimSchema[k][2]})`
          );
        }
      }
    }
  }
  // console.log(errorStack);
  return errorStack;
}

async function tableCheck_do(Pool, Schema, title) {
  let logObj = {};
  var literal = [];
  for (var k in Schema) {
    let SchemaDBRaw = await _schemaQuery(Pool, k);
    if (SchemaDBRaw.res.data !== null) {
      const SchemaDBByColumn = SchemaDBRaw.res.data.reduce(
        (accumulator, current) => {
          accumulator[current.column_name] = current;
          return accumulator;
        },
        {}
      );

      let SchemaCheck = _schemaCheck(Schema[k]);
      logObj[k] = schemaCompare("", SchemaDBByColumn, SchemaCheck);
    } else {
      console.log(`${[k]}資料表未建立，將依腳本生成`);
    }

    literal.push(_tableCheck(Pool, k, Schema[k]));
  }

  await Promise.all(literal);
  log.info(`===${title}系列檢查OK===`, log_DEBUG);
  return logObj;
}

function tableCheck_systemLevel(Pool) {
  const title = "systemLevel";
  var literal = [];
  const Schema = {
    login_record: `
        CREATE TABLE IF NOT EXISTS @@@ (
            uuid uuid NOT NULL UNIQUE,
            acc_uuid uuid,
            statement text,
            record_ts bigint
        );`,
    event_record: `
        CREATE TABLE IF NOT EXISTS @@@ (
            uuid uuid NOT NULL UNIQUE,
            acc_uuid uuid,
            statement text,
            record_ts bigint
        );`,
    account: `
        CREATE TABLE IF NOT EXISTS @@@ (
            uuid uuid NOT NULL UNIQUE,
            account varchar(50),
            logincheck varchar(50),
            staff_uuid uuid,
            status int
        );`,
    staff: `
        CREATE TABLE IF NOT EXISTS @@@ (
            uuid uuid NOT NULL UNIQUE,
            name varchar(20),
            authority_id int
        );`,
    acc_state: `
        CREATE TABLE IF NOT EXISTS @@@ (
            id int UNIQUE,
            state varchar(20)
        );`,
    authority: `
        CREATE TABLE IF NOT EXISTS @@@ (
            id int NOT NULL UNIQUE,
            name varchar(20)
        );`,
    announcement: `
        CREATE TABLE IF NOT EXISTS @@@ (
            uuid uuid NOT NULL UNIQUE,
            content text,
            release_ts bigint
        );`,
  };
  return tableCheck_do(Pool, Schema, title);
}
function tableCheck_assetLevel(Pool) {
  const title = "assetLevel";
  var literal = [];
  const Schema = {
    image: `
          CREATE TABLE IF NOT EXISTS @@@ (
              image_uuid uuid NOT NULL UNIQUE,
              image_url text,
              name varchar(50)
          );`,
    model: `
          CREATE TABLE IF NOT EXISTS @@@ (
              model_uuid uuid NOT NULL UNIQUE,  
              model_url text,
              name varchar(50)
          );`,
    object: `
          CREATE TABLE IF NOT EXISTS @@@ (
              uuid uuid NOT NULL UNIQUE,
              image_uuid uuid,
              model_uuid uuid,
              obj_name varchar(50)
          );`,
    device: `
          CREATE TABLE IF NOT EXISTS @@@ (
              uuid uuid NOT NULL UNIQUE,
              object_uuid uuid,
              location text,
              state_id int,
              device_name varchar(50),
              type varchar(50)
          );`,
    device_type: `
          CREATE TABLE IF NOT EXISTS @@@ (
              type varchar(50) NOT NULL UNIQUE
          );`,
    device_state: `
          CREATE TABLE IF NOT EXISTS @@@ (
              id int UNIQUE,
              statement varchar(20)
          );`,
  };
  return tableCheck_do(Pool, Schema, title);
}
function tableCheck_maintenanceLevel(Pool) {
  const title = "maintenanceLevel";
  var literal = [];
  const Schema = {
    workorder: `
          CREATE TABLE IF NOT EXISTS @@@ (
              uuid uuid NOT NULL UNIQUE,
              device_uuid uuid,
              issue int,
              report_staff uuid,
              manage_staff uuid,
              maintenance_staff uuid,
              state int,
              report_ts bigint,
              assign_ts bigint,
              accept_ts bigint,
              reject_ts bigint,
              finish_ts bigint,
              deadline bigint,
              history text
          );`,
    work_state: `
          CREATE TABLE IF NOT EXISTS @@@ (
            id int UNIQUE,
            statement varchar(20)
          );`,
    issue: `
          CREATE TABLE IF NOT EXISTS @@@ (
            id int UNIQUE,
            statement varchar(20)
          );`,
  };
  return tableCheck_do(Pool, Schema, title);
}
module.exports = {
  system: tableCheck_systemLevel,
  asset: tableCheck_assetLevel,
  maintenance: tableCheck_maintenanceLevel,
};
