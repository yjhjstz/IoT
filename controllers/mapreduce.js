'use strict';
var Air = require('../models/air');



module.exports.getAvgPm25ByID = function(query, callback) {
    var o = {}, self = this;
    o.query = query;
    o.map = function () {
        var ts = this.updated;
        var time = new Date(ts.getYear() + 1900, ts.getMonth(), ts.getDay());

        emit({ts: time, sensorId: this.sensorId }, this.sum/this.count);
    };
    o.reduce = function (key, values) {
        return Array.sum(values) / values.length;
    };

    o.out = { replace: 'avgPm25ByID' };
    o.verbose = true;

    Air.mapReduce(o, function (err, model, stats) {
      console.log(stats);
      model.find().exec(function (err, docs) {
        callback(err, docs);
      });
    });
};