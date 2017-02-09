const mqtt = require('mqtt');
const SerialPort = require('serialport');
const client = mqtt.connect('mqtt://localhost:1883'); // TODO config
var port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 2400
});

var buffer = [];
var count = 0;
var bufferComplete = false;

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
    var byte = data.readUInt8(i);
    buffer[count] = byte;

    if (buffer[count] == 0xAA) {
      count = 0;
    } else if (buffer[count] == 0xFF) {
      bufferComplete = true;
    }

    count++;
    if (count >= 7) {
      count = 0;
    }
  }

  if (bufferComplete === true) {
    bufferComplete = false;
    port.pause(); // pause
    if (buffer[1] + buffer[2]+buffer[3] + buffer[4] != buffer[5]) {
      console.log('check bit error!');
      return;
    }
    var v_out = 0;
    v_out = ((buffer[1]*256)+buffer[2])*5/1024;
    var ppm = v_out*1000*0.5;
    console.log("ppm = " + ppm + "ug/m3");

    var air = {
        sensorId: id,
        pm25: ppm,
        probe: 'sensor pm25',
        updated: new Date(),
        location: [
            114.434945, 38.583943
        ]
    };
    console.log(air);
    client.publish('/stats/air', JSON.stringify(air));
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
  port.resume();
}, 1000);




