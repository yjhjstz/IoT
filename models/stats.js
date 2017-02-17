'use strict';
const util = require('../utils/common');
const Air = require('../models/air');

// TODO save data to mongodb
exports.saveMetrics = (payload) => {
    var json = JSON.parse(payload);
    if(!json) return;
    var date = new Date(json.updated);
    var ts = util.formatSecond(date);
    var seconds = date.getSeconds();
    var val = {};
    val[seconds] = json.pm25;
    var query = {updated: ts, sensorId:json.sensorId };
    // Air.update(query, {$addToSet: {'pm25': val },
    //                    $set:{ probe: json.probe, location: json.location},
    //                    $inc: { count: 1, sum: json.pm25 }
    //                   }, {upsert:true}, function(err, raw) {
    //       if (err) throw err;
    //       console.log(raw);
    // });
}
