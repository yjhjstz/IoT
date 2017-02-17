'use strict';
var Air = require('../models/air');


// TODO map / reduce
module.exports.getAvgPm25ByID = function(query, callback) {
    var o = {}, self = this;
    o.query = query;
    o.map = function () {
        
    };
    o.reduce = function (key, values) {
        
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
