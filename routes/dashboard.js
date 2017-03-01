var express = require('express');
var router = express.Router();
var util = require('../utils/common');
var broker = require('../mqtt/mqttBroker').broker;




router.get('/', function(req, res, next) {
  res.render('dashboard', {});
})


module.exports = router;
