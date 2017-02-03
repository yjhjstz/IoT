'use strict';
const util = require('../utils/common');
const Air = require('../models/air');

// save data to mongodb
exports.saveAir = (payload) => {
    var json = JSON.parse(payload);
    if(!json) return;
    var date = new Date(json.updated);
    var ts = util.formatSecond(date);
    var seconds = date.getSeconds();
    var val = {};
    val[seconds] = json.pm25;
    var query = {updated: ts, sensorId:json.sensorId };
    Air.update(query, {$addToSet: {'pm25': val }, $set:{ probe: json.probe } }, {upsert:true}, function(err, raw) {
          if (err) throw err;
          console.log(raw);
    });
}
