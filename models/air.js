const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airSchema = new Schema({
    sensorId: { type: Number, default: 0 },
    updated: { type: Date, default: Date.now },
    pm25: [ {} ],
    probe: String
});

airSchema.index({updated:-1, sensorId:1}, {unique: true}); // schema level

const ModelClass = mongoose.model('air', airSchema);

module.exports = ModelClass;