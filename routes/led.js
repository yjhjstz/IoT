var express = require('express');
var router = express.Router();
var util = require('../utils/common');
var broker = require('../mqtt/mqttBroker').broker;



// TODO get status
router.get('/api/led/', function(req, res, next) {

});


router.post('/api/led/', function(req, res, next) {
    console.log(req.body);
    util.checkParams(req.body, ['id', 'action']);
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


module.exports = router;
