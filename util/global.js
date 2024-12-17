// PUBLIC
var global = {};
//
exports.set = (key, val) => {
  console.log("global set");
  var flag;
  if (!global[key]) {
    flag = 0;
  } else {
    flag = 1;
  }
  global[key] = val;
  return flag;
};
exports.get = (key) => {
  return global[key];
};
