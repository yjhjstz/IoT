var moment = require('moment');

function formatTime(time) {
    var t = moment(time).toObject();
    t.seconds = 0;
    t.milliseconds = 0;
    return moment(t).toDate();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports.formatTime = formatTime;
module.exports.getRandomInt = getRandomInt;