'use strict';
const mosca = require('mosca');
const chalk = require('chalk');
const ip = require('ip');
const stats = require('../models/stats');
const config = require('../config');



const database = {
    type: 'mongo',
    url: config.mongodb,
    pubsubCollection: 'mqttBroker',
    mongo: {}
};

const brokerPort = config.brokerPort;
const brokerSettings = {
    port: brokerPort,
    backend: database,
    ttl: {
        subscriptions: 1000 * 60 * 10,
        packets: 1000 * 60 * 10
    }
}

var broker = new mosca.Server(brokerSettings);

broker.on('ready', brokerReady);

broker.on('clientConnected', clientConnected);

broker.on('clientDisconnected', clientDisconnected);

broker.on('published', function(packet, client){
    console.log(chalk.blue(packet.topic)+'  ' + packet.payload.toString());
    switch(packet.topic) {
        case '/stats/air':
            stats.saveMetrics(packet.payload.toString());
            break;
    }
});

function brokerReady(){
    console.log(chalk.cyan('MQTT Broker running on: ' + ip.address() + ':' + brokerPort));
}

function clientConnected(client){
    console.log(chalk.cyan(client.id)+ '  '+chalk.green('Connected'));
}

function clientDisconnected(client){
    console.log(chalk.cyan(client.id) + '  ' + chalk.red('Disconnected'));
}


exports.broker = broker;

