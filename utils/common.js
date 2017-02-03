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

module.exports.formatSecond = formatSecond;
module.exports.formatDay = formatDay;
module.exports.getRandomInt = getRandomInt;