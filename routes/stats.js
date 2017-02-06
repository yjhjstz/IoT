var Air = require('./../models/air');
var moment = require('moment');
var util = require('../utils/common');
var mr = require('../controllers/mapreduce');
var express = require('express');
var router = express.Router();

router.get('/api/air/:id/ts',function (req, res, next) {
    console.log(req.query);
    var sensorid = req.params.id;
    // minus min
    var st = new Date(req.query.st);
    var et = new Date(req.query.et);
    var query = {
        sensorId: sensorid,
        updated: { $gte: st.toISOString(),
                   $lt: et.toISOString()
                 }
    };
    var find = Air.find(query).select('pm25 updated -_id');

    find.exec(function (err, data) {
        if(err) {
            console.error(err);
            return;
        }

        res.send(data);
    });

});

router.get('/api/air/all/:id',function (req, res, next) {
    console.log(req.params);
    var sensorid = req.params.id;
    var query = {
        sensorId: sensorid
    };
    var find = Air.find(query).select('pm25 updated -_id');

    find.exec(function (err, data) {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

router.get('/api/air/avg/:id', function(req, res, next) {
    console.log(req.params);
    var sensorid = req.params.id;
    var query = {
        sensorId: sensorid
    };
    mr.getAvgPm25(query, function(err, result){
        if (err) {
            console.error(err);
            return;
        }
        console.log(result);
        res.send(result);
    });

});

router.get('/api/air/geo/avg', function(req, res, next) {
    console.log(req.query);
    var longitude = req.query.longitude;
    var lattitude = req.query.lattitude;
    var distance = req.query.distance / 6378;
    var query = { location: { $geoWithin: { $centerSphere: [ [ longitude, lattitude ] ,
                                                     distance ] } } };
    mr.getAvgPm25ByID(query, function(err, result){
        if (err) {
            console.error(err);
            return;
        }
        console.log(result);
        res.send(result);
    });

});


module.exports = router;
