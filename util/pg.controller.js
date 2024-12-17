var pg = require("pg");
var $pg = require("./pg.query.js");
const { argv } = require("process");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");
const configOnline = require("../config/pg.settle.json").online;
const configOffline = require("../config/pg.settle.json").offline;
var log = require("../util/log.js");
const log_DEBUG = true;
let _procces_uuid = null;
var Pool = null;

function dbInit(localhost_check) {
  var prom = new Promise((resolve, reject) => {
    if (localhost_check) {
      Pool = new pg.Pool(configOffline);
    } else {
      Pool = new pg.Pool(configOnline);
    }
    Pool.connect((err, client, release) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
      client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
          return console.error("Error executing query", err.stack);
        }
        log.info(`資料庫連線測試：${result.rows[0].now}連線成功！`, log_DEBUG);
        resolve(Pool);
      });
    });
  });
  return prom;
}

// Character
function characterList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
            select * from character where 1=1
        `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}

// Image
function imageList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              select * from image
          `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function imageAdd(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              INSERT INTO public.image
                (image_uuid, image_url, "name")
                VALUES('${uuidv4()}', './img/${data.image_url}', '${
                  data.name
                }');
          `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function imageUpdate(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
                UPDATE public.image
                SET "name"='${data.name}'
                WHERE image_uuid='${data.image_uuid}';
            `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}
function imageDelete(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
            DELETE FROM public.image
            WHERE image_uuid='${data.image_uuid}';
        `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}

// Model
function modelList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              select * from model
          `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function modelAdd(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              INSERT INTO public.model
                (model_uuid, model_url, "name")
                VALUES('${uuidv4()}', './model/${data.model_url}', '${
                  data.name
                }');
          `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function modelUpdate(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
                UPDATE public.model
                SET "name"='${data.name}'
                WHERE model_uuid='${data.model_uuid}';
            `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}
function modelDelete(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
            DELETE FROM public.model
            WHERE model_uuid='${data.model_uuid}';
        `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}

// device_type
function deviceTypeList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              select * from device_type
          `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
// device
function deviceList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              select * from device where 1=1
          `;
    if (data.type) sqlstr += `and type='${data.type}'`;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
// WorkOrder
function workOrderList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              SELECT 
              w."uuid" AS workorder_uuid, 
              w.report_staff, 
              w.manage_staff, 
              w.maintenance_staff, 
              w.state, 
              w.report_ts, 
              w.assign_ts, 
              w.accept_ts, 
              w.reject_ts, 
              w.finish_ts, 
              w.deadline, 
              w.history,
              d."uuid" AS device_uuid,
              d."type" AS device_type,
              d.device_name,
              ws."statement" as work_state,
              s.name as report_staff_name,
              ms.name as maintenance_staff_name,
              i."statement" as issue
              FROM public.workorder w
              LEFT JOIN public.device d ON d."uuid" = w.device_uuid
              LEFT JOIN public.work_state ws ON ws."id" = w.state
              LEFT JOIN public.staff s ON s."uuid" = w.report_staff 
              LEFT JOIN public.staff ms ON ms."uuid" = w.maintenance_staff
              LEFT JOIN public.issue i ON i."id" = w.issue
              WHERE 1=1;
          `;

    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function workOrderAdd(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
            INSERT INTO public.workorder
            ("uuid", device_uuid, issue, report_staff, manage_staff, maintenance_staff, state, report_ts, assign_ts, accept_ts, reject_ts, finish_ts, deadline, history)
            VALUES('${uuidv4()}', '${data.device_uuid}', ${data.issue}, '${
              data.report_staff
            }', NULL, NULL, 0, ${new Date().getTime()}, NULL, NULL, NULL, NULL, NULL, '');
          `;

    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
function workOrderUpdate(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
                UPDATE workorder SET
            `;
    let updates = [];
    if (data.maintenance_staff)
      updates.push(`"maintenance_staff"='${data.maintenance_staff}'`);
    if (data.state) updates.push(`state=${data.state}`);
    if (data.assign_ts) updates.push(`assign_ts=${data.assign_ts}`);
    if (data.deadline) updates.push(`deadline=${data.deadline}`);

    sqlstr += updates.join(", ");
    sqlstr += ` WHERE uuid='${data.uuid}'`;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        console.log(sqlstr);

        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}
function workOrderDelete(data) {
  return new Promise((resolve, reject) => {
    if (!data.uuid) resolve({ success: false, error: `沒有提供uuid` });

    let sqlstr = `
            DELETE FROM workorder
            WHERE uuid='${data.model_uuid}';
        `;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
  });
}

// staff
function staffList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              SELECT * from staff
              where 1=1
          `;
    if (data.authority_id) sqlstr += `and authority_id='${data.authority_id}'`;
    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
// Issue
function issueList(data) {
  return new Promise((resolve, reject) => {
    let sqlstr = `
              select * from issue
          `;

    $pg.query(Pool, sqlstr).then((result) => {
      if (result.state == -1) {
        resolve({ success: false, data: null, error: ``, errorCode: 1 });
      } else {
        resolve({ success: true, data: result.data });
      }
    });
    // resolve()
  });
}
module.exports = {
  init: dbInit,
  procces_uuid_set: function (uuid) {
    _procces_uuid = uuid;
  },
  Character: {
    characterList,
  },
  image: {
    list: imageList,
    add: imageAdd,
    update: imageUpdate,
    delete: imageDelete,
  },
  model: {
    list: modelList,
    add: modelAdd,
    update: modelUpdate,
    delete: modelDelete,
  },
  device: {
    list: deviceList,
  },
  deviceType: {
    list: deviceTypeList,
  },
  workOrder: {
    list: workOrderList,
    add: workOrderAdd,
    update: workOrderUpdate,
    delete: workOrderDelete,
  },
  issue: {
    list: issueList,
  },
  staff: {
    list: staffList,
  },
};
