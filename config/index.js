'use strict';

const path = require('path');
const fs = require('fs');

const config = {
  name: 'default',
  numCPUs: 4,
  port: 8001,
  mongodb: 'mongodb://localhost:27017/iot',
  brokerPort: 1883
};

var customConfig = path.join(__dirname, 'config.js');
if (fs.existsSync(customConfig)) {
  var options = require(customConfig);
  Object.assign(config, options);
}

module.exports = config;