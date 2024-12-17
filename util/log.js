var _flag = true;
var hightlightFlag = false;
console.log('\x1b[36m %s \x1b[0m', "log.js enable");
function hightlight() {
    process.stdout.write('\x1b[41m')
}

exports.hightlight = (flag) => {
    if (!flag || !_flag) return;
    hightlightFlag = true;
}
exports.info = (text, flag) => {
    if (!flag || !_flag) return;
    if (hightlightFlag) {
        hightlight();
    }
    console.log('\x1b[36m %s \x1b[0m', text);
}
exports.warn = (text, flag) => {
    if (!flag || !_flag) return;
    if (hightlightFlag) {
        hightlight();
    }
    console.log('\x1b[33m %s \x1b[0m', text);
}
exports.todo = (text, flag) => {
    if (!flag || !_flag) return;
    if (hightlightFlag) {
        hightlight();
    }
    console.log('\x1b[45m %s \x1b[0m', text);
}
exports.stop = () => {
    _flag = false;
    console.log('\x1b[33m %s \x1b[0m', "log輸出終止");
}