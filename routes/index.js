var express = require('express');
var router = express.Router();
var broker = require('../mqtt/mqttBroker').broker;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/led/:id/:action', function(req, res, next) {
    var id = req.params.id;
    var packet = {
      topic: '/led/' + id,
      payload: req.params.action,
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
