'use strict';
var Air = require('../models/air');


module.exports.getAvgPm25 = function(query, callback) {
    var o = {}, self = this;
    o.query = query;
    o.map = function () {
        var ts = this.updated;
        var key = new Date(ts.getYear(), ts.getMonth(), ts.getDay());

        emit(key, this.sum/this.count);
    };
    o.reduce = function (key, values) {
        return Array.sum(values) / values.length;
    };

    o.out = { replace: 'avgPm25PerDay' };
    o.verbose = true;

    Air.mapReduce(o, function (err, model, stats) {
      console.log(stats);
      model.find().exec(function (err, docs) {
        callback(err, docs);
      });
    });
};