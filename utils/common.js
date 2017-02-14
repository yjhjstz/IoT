var moment = require('moment');

function formatSecond(time) {
    var t = moment(time).toObject();
    t.seconds = 0;
    t.milliseconds = 0;
    return moment(t).toDate();
}

function formatDay(time) {
    var t = moment(time).toObject();
    t.seconds = 0;
    t.milliseconds = 0;
    t.minutes = 0;
    t.hours = 0;
    return moment(t).toDate();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// 部分保留
function checkParams(params, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      throw new Error('Parameter missed: ' + key);
    }
  }
}

module.exports.formatSecond = formatSecond;
module.exports.formatDay = formatDay;
module.exports.getRandomInt = getRandomInt;
module.exports.checkParams = checkParams;