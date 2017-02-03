'use strict';
var Air = require('../models/air');


module.exports.getAvgPm25 = function(query, callback) {
    var o = {}, self = this;
    o.query = query;
    o.map = function () {
        var ts = this.updated;
        var key = new Date(ts.getYear(), ts.getMonth(), ts.getDay());
        var val = 0;

        this.pm25.forEach(function(value) {
            var keys = Object.keys(value);
            val += value[keys[0]];
        });

        val = val / this.pm25.length;
        emit(key, val);
    };
    o.reduce = function (key, values) {
        return Array.sum(values) / values.length;
    };

    o.out = { replace: 'avgPm25PerDay' };
    o.verbose = true;

    Air.mapReduce(o, function (err, model, stats) {
      console.log(stats);
      model.find().exec(function (err, docs) {
        console.log(docs);
        callback(err, docs);
      });
    });
};