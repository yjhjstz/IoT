var Air = require('./../models/air');
var moment = require('moment');
var util = require('../utils/common');
var mr = require('../controllers/mapreduce');
var express = require('express');
var router = express.Router();

var geoCoordMap = {
    '杭州':[120.19,30.26],
};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};

// 部分保留
var checkParams = function (params, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      throw new Error('Parameter missed: ' + key);
    }
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Air overview'});
});

router.get('/trend', function(req, res, next) {
  res.render('trend', {title: 'Air trends'});
});

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
            var data = [
                {
                    name: '杭州',
                    value: result[0].value || 'unknown'
                }
            ];
            //
            res.json({data: convertData(data)});
        });
    } else {
        var find = Air.find(query).select('sum count updated -_id').sort({'updated': 1}).limit(128);

        find.exec(function (err, result) {
            if(err) {
                console.error(err);
                return;
            }
            var data = {x:[], y:[]};
            result.forEach(function(item) {
                data.x.push(item.updated);
                data.y.push(item.sum/item.count);
            });
            res.json(data);
        });
    }
});


module.exports = router;
