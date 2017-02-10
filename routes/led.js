var express = require('express');
var router = express.Router();
var broker = require('../mqtt/mqttBroker').broker;
var clone = require('clone');
var responses_x_questions = require('../models/barChart.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  var chartOptions = clone(responses_x_questions);

  var categories = ["newCat1","newCat2","newCat3","newCat4","newCat5"];

  chartOptions.xAxis[0].data = categories;
  chartOptions.series[0].data = [10,20,30,40,50];

  res.render('index', { title: 'Express ejs', data: JSON.stringify(chartOptions) });
});

// TODO get status
router.get('/api/led/', function(req, res, next) {

});


router.post('/api/led/', function(req, res, next) {
    console.log(req.body);
    var id = req.body.id;
    var packet = {
      topic: '/led/' + id,
      payload: req.body.action,
      qos: 1,
      retain: false
    };

    broker.publish(packet, function() {
      console.log('Message sent');  // it passes by here
      res.json({ result:true });
    });

});

// status 通过 publish topic 定时发布

module.exports = router;
