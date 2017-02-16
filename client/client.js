const mqtt = require('mqtt');
const util = require('../utils/common');
const client = mqtt.connect('mqtt://localhost:1883');
const chalk = require('chalk');
const lbs = require('node-qqwry');


// 获取本机的ipv4的地址列表
var getAllIPv4 = function () {
  var interfaces = require('os').networkInterfaces();
  var iplist = [];
  Object.keys(interfaces).forEach(function (key) {
    var itf = interfaces[key];
    for (var i = 0; i < itf.length; i++) {
      var item = itf[i];
      if (!item.internal && item.family === 'IPv4') {
        var ip = item.address;
        if (ip.indexOf('10.') == 0 ||
            ip.indexOf('172.') == 0 ||
            ip.indexOf('192.') == 0) {
          // do nothing
        } else {
          iplist.push(ip);
        }
      }
    }
  });
  return iplist;
};


var geo = lbs.getBounds(getAllIPv4()[0]);
console.log(geo.slice(0,2));

var args = process.argv.slice(2);
if (args.length <= 0) {
    console.log('usage: node client.js id\n');
    process.exit(-1);
}

var id = args[0];
client.subscribe('/led/' + id);

client.on('connect', () => {
    console.log(chalk.cyan('Client connected!'));
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(chalk.blue(topic)+'  ' + message.toString());

  var type = topic.split('/')[1];
  if (type === 'led') {
    var id = topic.split('/')[2];
    var status = message.toString();
    var led = {
      id: id,
      stats: status,
      updated: new Date()
    }

    client.publish('/stats/led', JSON.stringify(led));
  }

});

setInterval(function () {
    var air = {
        sensorId: id,
        pm25: util.getRandomInt(1,350),
        probe: 'node.js',
        updated: new Date(),
        location: [
            geo[0],geo[1]
        ]
    };
    console.log(air);
    client.publish('/stats/air', JSON.stringify(air));
}, 5000);