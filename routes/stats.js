var Air = require('./../models/air');
var moment = require('moment');
var util = require('../utils/common');
var express = require('express');
var router = express.Router();

router.get('/air/:id/:before',function (req, res, next) {
    console.log(req.params);
    var sensorid = req.params.id;
    // minus min
    var timebefore = req.params.before;
    var c = util.formatTime(moment().subtract(timebefore, 'm').toDate());
    var query = {
        sensorId: sensorid,
        updated: { $gte: c.toISOString() }
    };
    var find = Air.find(query).select('pm25 updated -_id');

    find.exec(function (err, data) {
        if(err) {
            console.error(err);
        }
        res.send(data);
    });
});

module.exports = router;
