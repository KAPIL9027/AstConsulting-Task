const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    chatId:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    subscription:{
        type: String,
        required: true
    }
})

const Subscription = mongoose.model('Subscription',userSchema);

module.exports = Subscription;