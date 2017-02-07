var Air = require('./../models/air');
var moment = require('moment');
var util = require('../utils/common');
var mr = require('../controllers/mapreduce');
var express = require('express');
var router = express.Router();

// 部分保留
var checkParams = function (params, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      throw new Error('Parameter missed: ' + key);
    }
  }
};

router.get('/api/air/', function(req, res, next) {
    console.log(req.query);
    var query = {};
    var sensorId = req.query.id;
    if (sensorId) {
        Object.assign(query, { sensorId: sensorId });
    }
    var longitude = req.query.longitude;
    var lattitude = req.query.lattitude;
    var distance = req.query.distance;
    if (longitude && lattitude && distance) {
        Object.assign(query, { location: { $geoWithin: { $centerSphere: [ [ longitude, lattitude ] ,
                                                     distance/6378 ] } } });
    }
    var st = req.query.st;
    var et = req.query.et;
    if (st && et ) {
        Object.assign(query, {updated: { 
                   $gte: new Date(st).toISOString(),
                   $lt: new Date(et).toISOString()
                 }});
    }
    var method = req.query.method;
    console.log(query);
    if (method) {
        mr.getAvgPm25ByID(query, function(err, result){
            if (err) {
                console.error(err);
                return;
            }
            console.log(result);
            res.send(result);
        });
    } else {
        var find = Air.find(query).select('pm25 updated -_id');

        find.exec(function (err, data) {
            if(err) {
                console.error(err);
                return;
            }

            res.send(data);
        });
    }


});


module.exports = router;
