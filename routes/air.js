var Air = require('./../models/air');
var moment = require('moment');
var util = require('../utils/common');
var mr = require('../controllers/mapreduce');
var express = require('express');
var router = express.Router();


router.get('/trend', function(req, res, next) {
  res.render('trend', {title: 'Air trends'});
});

router.get('/api/aqi', function(req, res, next) {
    var find = Air.find().sort({$natural:-1}).limit(1);

    find.exec(function (err, result) {
        if(err) {
            console.error(err);
            return;
        }
        res.json(result);
    });
});

router.get('/api/air/', function(req, res, next) {
    console.log(req.query);
    var query = {};
    util.checkParams(req.query, ['id', 'st', 'et']);
    
    var st = req.query.st;
    var et = req.query.et;
    if (st && et ) {
        Object.assign(query, {updated: { 
                   $gte: new Date(st).toISOString(),
                   $lt: new Date(et).toISOString()
                 }});
    }

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

    var precision = req.query.precision;
    console.log(query);
    var data = {x:[], y:[]};
    if (precision && precision === 'day') {
        mr.getAvgPm25ByID(query, function(err, result){
            if (err) {
                console.error(err);
                return;
            }
            result.forEach(function(item) {
                data.x.push(item._id.ts);
                data.y.push(item.value);
            });
            res.json(data);
        });
    } else {
        var find = Air.find(query).select('sum count updated -_id').sort({'updated': -1}).limit(128);

        find.exec(function (err, result) {
            if(err) {
                console.error(err);
                return;
            }
            result.reverse();
            result.forEach(function(item) {
                data.x.push(item.updated);
                data.y.push(item.sum/item.count);
            });
            res.json(data);
        });
    }
});


module.exports = router;
