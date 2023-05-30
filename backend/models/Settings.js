const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    telbotApiKey:
    {
        type: String,
        required: true
    },
    weatherApiKey:
    {
        type: String,
        required: true
    }
})

const Settings = mongoose.model('Settings',settingsSchema);

module.exports = Settings;