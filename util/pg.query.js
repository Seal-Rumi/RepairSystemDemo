
const fs = require('fs')
function pgQuery(pool, sql) {
    var prom = new Promise((resolve, reject) => {
        pool.query(sql, (error, results) => {
            if (error) {
                error_recode(error)
                return resolve({ state: -1, data: error })
            }
            var responseData;
            var responseState;
            if (results === undefined) {
                responseState = -1;
                responseData = null;
            } else if (results.rows && results.rows.length === 0) {
                responseState = 2;
                responseData = null;
            } else {
                responseState = 0;
                responseData = results.rows;
            }
            resolve({ state: responseState, data: responseData });
        });
    });
    return prom;
}
function error_recode(error) {
    let thisDate = new Date().toLocaleString("zh-TW")
    let folder = thisDate.split(' ')[0].split('/').join('_')
    if (!fs.existsSync(`./log/pg.error/${folder}`)) {
        fs.writeFileSync(`./log/pg.error/${folder}`, '', err => { })
    }
    let error_log = `=====${thisDate}=====\n${error}\n`
    fs.appendFileSync(`./log/pg.error/${folder}`, error_log, (err => { }))
}


module.exports = {
    query: pgQuery,
};