const pgControl = require('./pg.controller.js');
const infController = require('./influxDB/controller.js')
const yargs = require("./yargs.main.js").yargs()

var argv = yargs.argv;
var Pool = null
let inf = null
InfluxDBInit()
async function InfluxDBInit() {
    let connect_result = await infController.init({ dev: true })
    if (connect_result.success) {
        inf = connect_result.data
        let check_reult = await infController.CreateDatabase()
        await infController.SetSechemaWithDatabase()
    }
}
if (process.send === undefined) {
    console.log('非法使用');
}
else {
    process.on('message', async function (m) {
        var data = m.data;
        switch (data.type) {
            case 'init':
                Pool = data.Pool
                if (Pool == null) {
                    Pool = await pgControl.init();
                }
                inf = data.inf
                if (inf == null) {
                    let connect_result = await infController.init({ dev: argv.dev })
                    inf = connect_result.data
                    let check_reult = await infController.CreateDatabase()
                    await infController.SetSechemaWithDatabase()
                }
                break;
            case 'restore':
                data = data.data
                if (!data.uuid || !data.table_name) {
                    return
                }
                for (let i in data.table_name) {
                    pgControl.influx.restore({ uuid: data.uuid, table_name: data.table_name[i] })
                }
                break;
            case 'SyncDeviceList':
                setInterval(() => { interval() }, 1000 * 60 * 60)
                interval()
                function interval() {
                    if (inf != null) {
                        inf.getDatabaseNames().then(async names => {
                            // console.log('My database names are: ' + names.join(', '))
                            let telegrafs = []
                            for (let i in names) {
                                if (names[i].includes('telegraf')) {
                                    telegrafs.push(`'${names[i]}'`)
                                }
                            }
                            let SyncResult = await pgControl.AMS.SyncDeviceList(telegrafs)
                            let log = !SyncResult.success ? SyncResult.error : '同步成功'
                            console.log(log);
                        });
                    }
                }
                break;
        }
    });
}