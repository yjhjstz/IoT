var express = require('express');
var router = express.Router();
var util = require('../utils/common');
var broker = require('../mqtt/mqttBroker').broker;


var ledStatus = [];

var initLedStatus = function (number) {
  for (var i = 0; i < number; i++) {
    if (i % 2) {
      ledStatus.push({id: i, status: 'on'})
    } else {
      ledStatus.push({id: i, status: 'off'})
    }
  }
}

var updateLedStatus = function(id, status) {
  ledStatus[id].status = status;
}

router.get('/led/status', function(req, res, next) {
  res.json(ledStatus);
})

router.get('/led/', function(req, res, next) {
  res.render('led', {title: 'Led demo', number: ledStatus.length, detail: ledStatus});
});

// TODO get status
router.get('/api/led/', function(req, res, next) {

});


router.post('/api/led/', function(req, res, next) {
    console.log('led control:', req.body);
    util.checkParams(req.body, ['id', 'action']);
    var id = req.body.id;
    updateLedStatus(id, req.body.action);
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




initLedStatus(16);
// status 通过 publish topic 定时发布

module.exports = router;
