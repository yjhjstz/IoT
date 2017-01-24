const mqtt = require('mqtt');
const util = require('../utils/common');
const client = mqtt.connect('mqtt://localhost:1883');
const chalk = require('chalk');

client.subscribe('/led/1');

client.on('connect', () => {    
    console.log(chalk.cyan('Client connected!'));
    var air = {
        sensorId: 1,
        pm25: util.getRandomInt(1,500),
        probe: 'node.js',
        updated: new Date()
    }
    console.log(air);
    client.publish('/stats/air', JSON.stringify(air));

});

client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(chalk.blue(topic)+'  ' + message.toString());
});