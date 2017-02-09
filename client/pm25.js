const mqtt = require('mqtt');
const SerialPort = require('serialport');
const client = mqtt.connect('mqtt://localhost:1883'); // TODO config
var port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 2400
});

var buffer = [];
var airs = [];

port.on('open', function() {
    console.log('open serialport.');
});

// open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message);
});

port.on('data', function (data) {
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    buffer.append(byte);
  }

  // make sure the first byte is 0xAA
  while (buffer[0] !== 0xAA && buffer[0] !== undefined) {
    buffer.shift();
  }

  if (buffer.length >= 7) {
    if (buffer[6] === 0xFF) {
      var crc = (buffer[1] + buffer[2] + buffer[3] + buffer[4]) % 256;
      if (crc === buffer[5]) {
        var v_out = ((buffer[1]*256)+buffer[2])*5/1024;
        var ppm = v_out * 1000 * 0.5;
        airs.append(ppm);
      }
      // remove the first 7 bytes
      buffer = buffer.slice(7, buffer.length);
    } else {
      // remove the first 0xAA, loop it when next data received.
      buffer.shift();
    }
  }
});

client.on('connect', function() {
    console.log('Client connected IoT!');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic+'  ' + message.toString());
});

// speed control
setInterval(function() {
  if (airs.length === 0) {
    console.log('error....');
    return;
  }
  var sum = 0;
  for (var i = 0; i < airs.length; i++) {
    sum += airs[i];
  }

  var air = {
    sensorId: id,
    pm25: sum / airs.length,
    probe: 'sensor pm25',
    updated: new Date(),
    location: [
      114.434945, 38.583943
    ]
  };

  console.log(air);
  client.publish('/stats/air', JSON.stringify(air));
  airs = [];
}, 1000);




