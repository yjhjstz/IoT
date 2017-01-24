const mqtt = require('mqtt');
const util = require('../utils/common');
const client = mqtt.connect('mqtt://localhost:1883');
const chalk = require('chalk');


var args = process.argv.slice(2);
if (args.length <= 0) {
    console.log('usage: node client.js id\n');
    process.exit(-1);
}

var id = args[0];
client.subscribe('/led/' + id);

client.on('connect', () => {    
    console.log(chalk.cyan('Client connected!'));
    var air = {
        sensorId: id,
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